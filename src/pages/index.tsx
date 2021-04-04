import SEO from "@/components/SEO";
import { client, prismic, prismicDOM } from "@/lib/prismic";
import { Document } from "@prismicio/client/types/documents";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Title } from "../styles/pages/Home";

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  return (
    <div>
      <SEO 
        title="DevCommerce, your best shop!" 
        image="logo.webp"
        shouldExcludeTitleSuffix />
      <section>
        <Title>Products</Title>
        
        <ul>
          {recommendedProducts.map(recommendedProduct => (
            <li key={recommendedProduct.id}>
              <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                <a>
                  {prismicDOM.RichText.asText(recommendedProduct.data.title)}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    prismic.Predicates.at('document.type', 'product')
  ]);
  
  return {
    props: {
      recommendedProducts: recommendedProducts.results
    }
  }
}