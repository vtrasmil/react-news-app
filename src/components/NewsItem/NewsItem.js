import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Details from "./Details/Details";
import { ReactComponent as ArrowIcon } from "../Images/ArrowIcon.svg";
import "./NewsItem.css";

function NewsItem(props) {
  const {
    imageUrl,
    alt,
    description,
    title,
    channel,
    published,
    urlNews,
    content,
  } = props;

  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/article", {
      state: {
        title,
        description,
        content,
        url: urlNews,
        imageUrl,
        channel,
        published,
      },
    });
  };

  return (
    <Card className="card">
      <Card.Img
        className="card-img"
        variant="top"
        src={imageUrl}
        alt={alt}
      />

      <Card.Body>
        <Card.Title>{title}</Card.Title>

        <Card.Text className="card-description">
          {description}
        </Card.Text>

        <Details channel={channel} published={published} />

        <Button className="card-btn" onClick={handleReadMore}>
          Read more <ArrowIcon className="arrow-icon" />
        </Button>
      </Card.Body>
    </Card>
  );
}

NewsItem.propTypes = {
  imageUrl: PropTypes.string,
  alt: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  channel: PropTypes.string,
  published: PropTypes.string,
  urlNews: PropTypes.string,
  content: PropTypes.string,
};

export default NewsItem;
