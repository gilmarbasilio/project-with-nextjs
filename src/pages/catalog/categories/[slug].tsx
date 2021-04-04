import { client, prismic, prismicDOM } from '@/lib/prismic';
import { Document } from '@prismicio/client/types/documents';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ products, category }: CategoryProps) {
  const router = useRouter();

  if(router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{prismicDOM.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map(product => (
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

export const getStaticPaths: GetStaticPaths = async ()  => {
  const categories = await client().query([
    prismic.Predicates.at('document.type', 'category'),
  ])

  const paths = categories.results.map(category => {
    return {
      params: {
        slug: category.uid
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});
  
  const products = await client().query([
    prismic.Predicates.at('document.type', 'product'),
    prismic.Predicates.at('my.product.category', category.id),
  ])

  return {
    props: {
      category,
      products: products.results
    },
    revalidate: 60
  }
}