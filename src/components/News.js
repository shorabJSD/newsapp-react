import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';








const News =(props)=>{



const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);    
const [page, setPage] = useState(1);
const [totalResults, setTotalResults] = useState(0);

const capitalizeFirstLetter=(string)=>{
  return string.charAt(0).toUpperCase() + string.slice(1);
}
 
  
 

 const updateUrl = async()=>{
  props.setProgress(0);
  let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=1&pageSize=${props.pageSize}`;
  setLoading(true)
  props.setProgress(10);
  let data = await fetch(url);
   props.setProgress(50);
  let parsedData = await data.json();
  props.setProgress(80);

  setArticles(parsedData.articles);
  setTotalResults(parsedData.totalResults);
  setLoading(false);
  props.setProgress(100);
}


useEffect(() => {
  document.title = `${capitalizeFirstLetter(props.category)} -NewsMonkey`
  updateUrl();
}, [])


 


 const fetchMoreData= async()=>{
   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=1&pageSize=${props.pageSize}`;
   setPage(page + 1)
  let data = await fetch(url);
  let parsedData = await data.json();
  setArticles(articles.concat(parsedData.articles));
  setTotalResults(parsedData.totalResults)
  }



    return (
      <>
        <h1 className=' text-center' style={{marginTop:"90px"}}>NewsMonkey - Top Heading {props.category} </h1>
        
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
          <div className="row ">
            {articles.map((element)=>{
              return <div className="col-md-4 my-3 " key={element.url}>
                        <NewsItem myTitle={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl ={element.url} source={element.source.name} author={element.author} timeUpdate={element.publishedAt}/>
                     </div>
            })}
          </div>
          </div>
          </InfiniteScroll>
      </>
    )

}


export default News;




News.defaultProps = {
  country: 'us',
  pageSize:8,
  category:"general"
}
News.proptTypes = {
  country:PropTypes.string,
  pageSize:PropTypes.number,
  category:PropTypes.string,
}




