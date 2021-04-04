import Prismic from '@prismicio/client';
import PrismicDom from "prismic-dom";

export const apiEndpoint = "https://commercefordev.cdn.prismic.io/api/v2";
 
export const client = (req = null) => {
  const options = req ? { req } : null;

  return Prismic.client(apiEndpoint, options);
}

export const prismic = Prismic;

export const prismicDOM = PrismicDom;