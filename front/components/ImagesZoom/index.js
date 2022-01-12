import React, { useState } from 'react';
import Slick from 'react-slick';
import PropTypes from 'prop-types';

import { Overlay, Header, SlickWrapper, ImgWrapper, Indicator, Global, CloseButton } from './styles';

const initialSlideIndex = 0;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlideIndex);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseButton onClick={onClose}>X</CloseButton>
      </Header>
      <div>
        <SlickWrapper>
          <Slick 
            initialSlide={initialSlideIndex}
            beforeChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map(v => (
              <ImgWrapper key={v.src}>
                <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1}
              {' '}
              /
              {images.length}
            </div>
          </Indicator>
          
        </SlickWrapper>
      </div>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired
};

export default ImagesZoom;
