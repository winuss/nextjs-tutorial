import Axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import Item from '../../src/component/Item';

// const Post = ({item}) => {
//   const router = useRouter()
//   const { id } = router.query;

//   const [item, setItem] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   const API_URL = `http://makeup-api.herokuapp.com/api/v1/products/${id}.json`;

//   function getData() {
//       Axios.get(API_URL).then(res => {
//           setItem(res.data)
//           setIsLoading(false)
//       })
//   }

//   useEffect(()=> {
//       if(id && id > 0) {
//         getData();
//       }
//   }, [id])

//   return (
//     <>
//       {
//         isLoading ? (
//         <div style={{padding: "380px 0"}}>
//           <Loader active inline='centered'>
//             Loading
//           </Loader>
//         </div>) : (
//           <Item item={item} />
//         )
//       }
//     </>
//   )
// }

const Post = ({item, name}) => {
  const router = useRouter();

  //router.isFallback 처음 랜더링이 안된 상태에서 true가 되고 이후 완료되면 false로 변경됨
  // console.log("fallback => ", router.isFallback);

  if (router.isFallback) {
    //랜더링이 안된 페이지는 랜더링시 로딩화면을 보여줌
    return (
      <div style={{ padding: "100px 0"}}>
        <Loader active inline="centered">
          Loading
        </Loader>
      </div>
    )
  }

  return (
    <>
    {item && (
        <>
          <Head>
            <title>{item.name}</title>
            <meta name="description" content={item.description}></meta>
          </Head>
          {name} 환경 입니다.
          <Item item={item} />
        </>
      )}
    </>
  );
};

export default Post;

//상품 리스트를 지정해주면 다이나믹 페이지도 정적 페이지로 만들수 있다.
// export async function getStaticPaths() {
//     return {
//         paths: [
//             { params: { id: "740"} },
//             { params: { id: "730"} },
//             { params: { id: "729"} }
//         ],
//         // fallback: false // 없는 페이지를 대응 안해줌
//         // 최초접속자는 랜더링된 페이지를 보게 되지만, 이후 접속자부터는 만들어진 정적 페이지를 보게 함(페이지가 많을때 유용)
//         fallback: true 
//     }
// }

export async function getStaticPaths() {
  const apiUrl = process.env.apiUrl;
  const res = await Axios.get(apiUrl);
  const data = res.data;

  return {
      // paths: [
      //     { params: { id: "740"} },
      //     { params: { id: "730"} },
      //     { params: { id: "729"} }
      // ],
      // paths : data.map(item => ({
      //   params: {
      //     id : item.id.toString()
      //   }
      // })),
      paths : data.slice(0,9).map(item => ({
        params: {
          id : item.id.toString()
        }
      })),
      fallback: true 
  }
}



export async function getStaticProps(context) {
  const id = context.params.id;
  const apiUrl = `http://makeup-api.herokuapp.com/api/v1/products/${id}.json`;
  const res = await Axios.get(apiUrl);
  const data = res.data;

  return {
    props: {
      item: data,
      name: process.env.name
    }
  }
}