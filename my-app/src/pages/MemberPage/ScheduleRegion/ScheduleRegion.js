import React from "react";
import Carousel from "../../../components/Carousel";

const countries = [
  {
    image: "https://www.datocms-assets.com/45470/1631110818-logo-react-js.png",
    title: "Brazil",
  },
  {
    image: "https://www.datocms-assets.com/45470/1631110818-logo-react-js.png",
    title: "China",
  },
  {
    image: "https://www.datocms-assets.com/45470/1631110818-logo-react-js.png",
    title: "France",
  },
  {
    image: "https://www.datocms-assets.com/45470/1631110818-logo-react-js.png",
    title: "Japan",
  },
  {
    image: "https://www.datocms-assets.com/45470/1631110818-logo-react-js.png",
    title: "Norway",
  },
];

const ScheduleRegion = () => {
  return (
    <div>
      <Carousel images={countries} />
    </div>
  );
};

export default ScheduleRegion;
