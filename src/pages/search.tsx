import { client, prismic, prismicDOM } from "@/lib/prismic";
import { Document } from "@prismicio/client/types/documents";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Link from "next/link";

interface SearchProps {
  searchResults: Document[]
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  function handleSearch(event: FormEvent) {
    event.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSearch('');
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search} 
          onChange={event => setSearch(event.target.value)} 
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map(product => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`}>
              <a>
                {prismicDOM.RichText.asText(product.data.title)}
              </a>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q } = context.query;

  if(!q) {
    return {
      props: {
        searchResults: []
      }
    }
  }

  const searchResults = await client().query([
    prismic.Predicates.at('document.type', 'product'),
    prismic.Predicates.fulltext('my.product.title', String(q)),
  ])

  return {
    props: {
      searchResults: searchResults.results,
    }
  }

}