import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import NullImage from "../../components/Images/nullImage.png";
import Loading from "../Loading/Loading";
import NewsItem from "../NewsItem/NewsItem";

import { v4 as uuidv4 } from "uuid";
import { Col, Row } from "react-bootstrap";

import { header } from "../../config/config";
import { endpointPath } from "../../config/api";

import { Container, Header, card } from "./index";

function News(props) {
  const { newscategory, country } = props;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const capitalize = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const category = newscategory;
  const title = capitalize(category);

  useEffect(() => {
    document.title = `${title} - News`;
  }, [title]);

  // -----------------------------
  // FETCH NEWS (STABLE FUNCTION)
  // -----------------------------
  const updatenews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        endpointPath(country, category)
      );

      setArticles(response.data?.articles || []);
    } catch (error) {
      console.error("News fetch error:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [country, category]);

  // -----------------------------
  // EFFECT TRIGGER
  // -----------------------------
  useEffect(() => {
    updatenews();
  }, [updatenews]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header>{header(title)}</Header>

          <Container>
            <Row>
              {articles.length > 0 ? (
                articles.map((element) => (
                  <Col
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    style={card}
                    key={element.url || uuidv4()}
                  >
                    <NewsItem
                      title={element.title || "No Title"}
                      description={element.description || ""}
                      content={element.content || ""}
                      published={element.publishedAt || ""}
                      channel={element.source?.name || "Unknown"}
                      alt="News image"
                      imageUrl={element.image || NullImage}
                      urlNews={element.url}
                    />
                  </Col>
                ))
              ) : (
                <p style={{ textAlign: "center", width: "100%" }}>
                  No Results Found
                </p>
              )}
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

News.defaultProps = {
  country: "ph",
  newscategory: "general",
};

News.propTypes = {
  country: PropTypes.string,
  newscategory: PropTypes.string,
};

export default News;
