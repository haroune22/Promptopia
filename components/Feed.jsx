"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard"



const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
    );
  };
const Feed = () => {
  const [Posts, setPosts] = useState([]);

  // Search states
  const [searchtext, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  useEffect(()=>{
    const fetchPost = async()=>{
      const response = await fetch('/api/prompt',{methode:'GET'})
      const data = await response.json();

      setPosts(data);
    }
    fetchPost()
  },[])
  
  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return Posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  }
      const handleSearchChange =(e)=>{
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);
    
        // debounce method
        setSearchTimeout(
          setTimeout(() => {
            const searchResult = filterPrompts(e.target.value);
            setSearchedResults(searchResult);
          }, 500)
        );
      };

  const handleTagClick =(tagName)=>{
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  }
  return (
    
      <section className="feed">
    <form className="relative w-full flex-center">
    <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchtext}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
    </form>
    {searchtext ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={Posts} handleTagClick={handleTagClick} />
      )}
      </section>
 
  )
}

export default Feed