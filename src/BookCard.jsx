import React, { useState } from 'react';
import { Card, CardImg, Modal } from 'reactstrap';
const BookCard = ({
  thumbnail,
  title,
  pageCount,
  language,
  description,
  authors,
  publisher,
  previewLink,
  infoLink,
  publishedDate
}) => {
  // States
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <Card style={{ width: '200px' }} className='m-auto '>
      <CardImg
        top
        style={{ width: '100%', height:'270px' }}
        src={thumbnail}
        alt={title}
        onClick={toggle}
      />
      <Modal isOpen={modal} toggle={toggle}>
        <div className='modal-header d-flex justify-content-center'>
          <h5 className='modal-title text-center' id='exampleModalLabel'>
            {title}
          </h5>
          <button
            aria-label='Close'
            className='close'
            type='button'
            onClick={toggle}
          >
            <span aria-hidden={true}>X</span>
          </button>
        </div>
        <div className='modal-body'>
          <div className='d-flex justify-content-between ml-3'>
            <img src={thumbnail} alt={title} style={{ height: '320px' }} />
            <div class="book-content">
              <p>{description}</p>
              <p>Páginas: {pageCount} | Idioma : {language} | Autor : {authors} | Publisher : {publisher} | Data de Publicação: {publishedDate}</p>
            </div>
          </div>
          <div>
          </div>
        </div>
        <div className='modal-footer'>
          <div className='left-silde'>
            <a
              href={previewLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Prévia do Livro
            </a>
          </div>
          <div className='divider'></div>
          <div className='right-silde'>
            <a
              href={infoLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Informações Gerais
            </a>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default BookCard;