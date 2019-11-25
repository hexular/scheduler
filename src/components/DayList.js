function TweetList(props) {
  const tweets = props.tweets.map(tweet => {
    return (
      <Tweet
        key={tweet.id}
        name={tweet.name}
        avatar={tweet.avatar}
        content={tweet.content}
        date={tweet.date}
      />
    );
  });

  return tweets;
}

ReactDOM.render(
  <TweetList tweets={tweets} />,
  document.getElementById("root")
); 