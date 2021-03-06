import React, {useState} from 'react';
import './App.css';
import {InputGroup, Input, InputGroupAddon, Button, Spinner} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';
import BookCard from './BookCard.jsx';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

function App() {
  const [maxResults] = useState(40);
  const [startIndex] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const browserSupport = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      window.onload = function() {
        document.getElementById('voice-search').style.display = 'none';
      }
    }
  }

  const voiceSearch = () => {
    setQuery('');
    SpeechRecognition.startListening();

    setTimeout(function(){
      handleSubmit();
    }, 3000);
  }

  const handleSubmit = () => {
    setScrollX(0);
    setLoading(true);
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${query + transcript}&maxResults=${maxResults}&startIndex=${startIndex}`
      )
      .then(res => {
        if (startIndex >= res.data.totalItems || startIndex < 1) {
          toast.error(
            `max reults must be between 1 and ${res.data.totalItems}`
          );
        } else {
          if (res.data.items.length > 0) {
            setCards(res.data.items);
            setLoading(false);
          }
        }
      })
      .catch(err => {
        setLoading(true);
        console.log(err.response);
    });
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleSubmit();
      resetTranscript();
    }
  }
 
  const mainHeader = () => {
    browserSupport();
    return (
      <div className='main-image d-flex justify-content-center align-items-center flex-column'>
        {}
        <div className='filter'></div>
        <h5
          className='display-2 text-center text-white mb-3'
          style={{ zIndex: 2 }}
        >
          Up! Tech Library
        </h5>
        <div className='search-form' style={{ width: '100%', zIndex: 2 }}>
          <InputGroup size='lg' className='mb-3'>
            <Input
              className='search-input'
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <InputGroupAddon addonType='append'>
              <Button id='voice-search' className='voice-search' color='secondary' onClick={voiceSearch}>
                <span className='tooltiptext'>Pesquisar por voz</span>
                <i className='fas fa-microphone'></i>
              </Button>
              <Button color='secondary' onClick={handleSubmit}>
                <i className='fas fa-search'></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    );
  };

  const [scrollX, setScrollX]= useState(0);

  const handleLeftArrow = () => {
      let x = scrollX + Math.round(window.innerWidth / 1.2);
      if(x > 0){
          x = 0;
      }
      setScrollX(x);
  }

  const handleRightArrow = () =>{
      let x = scrollX - Math.round(window.innerWidth / 1.2);
      let listW = maxResults * 204;
      if(window.innerWidth - listW > x)
      {
          x = (window.innerWidth - listW) - 60;
      }
      setScrollX(x);
  }

  const handleCards = () => {
    if (loading) {
      return (
        <div className='d-flex justify-content-center mt-3'>
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        let thumbnail = 'default.jpg';
        if (item.volumeInfo.imageLinks) {
          thumbnail = item.volumeInfo.imageLinks.thumbnail;
        }

        return (
          <div className='bookRow--item' key={item.id}>
            <BookCard
              thumbnail={thumbnail}
              title={item.volumeInfo.title}
              pageCount={item.volumeInfo.pageCount}
              language={item.volumeInfo.language}
              authors={item.volumeInfo.authors}
              publisher={item.volumeInfo.publisher}
              publishedDate={item.volumeInfo.publishedDate}
              description={item.volumeInfo.description}
              previewLink={item.volumeInfo.previewLink}
              infoLink={item.volumeInfo.infoLink}
            />
          </div>
        );
      });
      return (
        <div className='container'>
          <div className='row' style={{
            marginLeft :scrollX,
            width: maxResults * 204
          }}>
            <div className="bookRow-left" onClick={handleLeftArrow}>
              <i className="fas fa-chevron-left"></i>
            </div>
            <div className="bookRow-right" onClick={handleRightArrow}>
              <i className="fas fa-chevron-right"></i>
            </div>
            {items}
          </div>
        </div>
      );
    }
  };

  return (
    <div className='w-100 h-100'>
      {mainHeader()}
      {handleCards()}
      <ToastContainer />
    </div>
  );
};

export default App;