import React, { useState, useEffect } from "react";
import { UncontrolledCarousel } from "reactstrap";

const AutoCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % props.items.length);
    }, 5000); // Change this value to adjust the carousel interval time
    return () => clearInterval(interval);
  }, [activeIndex, props.items.length]);

  return <UncontrolledCarousel activeIndex={activeIndex} items={props.items} />;
};

export default AutoCarousel;
