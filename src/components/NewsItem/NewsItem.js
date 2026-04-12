import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowIcon } from "../Images/ArrowIcon.svg";

function NewsItem({
  title,
  description,
  content,
  imageUrl,
  urlNews,
  channel,
  published,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/article", {
      state: {
        title,
        description,
        content,
        url: urlNews,
        image: imageUrl,
        channel,
        published,
      },
    });
  };

  const preview =
    description ||
    content?.slice(0, 180) ||
    "No preview available";

  return (
    <Card>
      <Card.Img src={imageUrl} />

      <Card.Body>
        <Card.Title>{title}</Card.Title>

        <Card.Text>{preview}</Card.Text>

        <Button onClick={handleClick}>
          Read more <ArrowIcon />
        </Button>
      </Card.Body>
    </Card>
  );
}

export default NewsItem;
