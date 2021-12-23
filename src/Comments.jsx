import React, { useState, useEffect, useContext, createContext } from "react";
import styled from "styled-components";

import TextArea from "react-textarea-autosize";

import Markdown from "./Markdown";
import Card from "./Card";
import Button from "./Button";
import _ from "lodash";

const CommentContext = createContext({});

function compare(a1, a2) {
  if (JSON.stringify(a1) === JSON.stringify(a2)) {
    return true;
  }
  return false;
}

function gen_comments(comments, colorindex, path) {
  return comments.map((comment, i) => {
    return (
      <Comment
        username={comment.username}
        date={comment.date}
        text={comment.text}
        votes={comment.votes}
        colorindex={colorindex}
        key={i}
        path={[...path, i]}
        comments={comment.comments}
      />
    );
  });
}

function Reply(props) {
  const [text, setText] = useState("");
  return (
    <div {...props}>
      <TextArea
        placeholder="What are your thoughts?"
        minRows={2}
        defaultValue={text}
        value={text}
        onChange={value => {
          setText(value.target.value);
        }}
      />
      <div className="panel">
        <div className="comment_as">
          Comment as{" "}
          <a href="" className="username">
            RJ
          </a>
        </div>
        <Button onClick={(e)=> addCommets(props, text, () => setText(''))}>COMMENT</Button>
      </div>
    </div>
  );
}

Reply = styled(Reply)`
  border-radius: 8px;
  border: solid 1px #3d4953;
  overflow: hidden;

  &.hidden {
    display: none;
  }

  textarea {
    font-family: inherit;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    resize: none;

    background: #13181d;
    padding: 12px;
    color: #cccccc;
    border: none;
    max-width: 100%;
    min-width: 100%;
  }

  .panel {
    display: flex;
    align-items: center;
    background: #3d4953;
    padding: 8px;

    .comment_as {
      font-size: 14px;
      color: #cccccc;
      margin-right: 8px;

      .username {
        display: inline-block;
        color: #4f9eed;
      }
    }

    ${Button} {
      font-size: 14px;
      margin-left: auto;
    }
  }
`;

function addCommets(props, text, callback) {
  let commentsData = props.comments;
  let path = ''
  props.path.map((x, index) => {
    if(index == 0){
      path += '[0]'
    }else{
      path += `comments[${x}]`
    }
  })
  let nestedData = _.get(commentsData, path);
  nestedData.comments.unshift({
    username: "RJ",
    date: "1 min ago",
    text: text,
    comments: []
  });
  _.set(commentsData, path, nestedData);
  props.setComments(commentsData);
  props.setReplying([])
  callback()
}

function Comment(props) {
  const { replyingKey, commentsKey } = useContext(CommentContext);
  const [replying, setReplying] = replyingKey
  const [comments, setComments] = commentsKey
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div {...props}>
      {hidden ? (
        <button
          id="showMore"
          onClick={() => {
            setHidden(false);
          }}
        >
          Show More Replies
        </button>
      ) : (
        <>
          <div id="right">
            <div id="top">
              <span id="username">
                <a href="">{props.username}</a>
              </span>
              <span id="date">
                <a href="">{props.date}</a>
              </span>
            </div>
            <div id="content" className={minimized ? "hidden" : ""}>
              <Markdown options={{ forceBlock: true }}>{props.text}</Markdown>
            </div>
            <div id="actions" className={minimized ? "hidden" : ""}>
              <span
                className={`${compare(replying, props.path) ? "selected" : ""}`}
                onClick={() => {
                  if (compare(replying, props.path)) {
                    setReplying([]);
                  } else {
                    setReplying(props.path);
                  }
                }}
              >
                reply
              </span>
            </div>
            <Reply
              comments={comments}
              setComments={setComments}
              setReplying={setReplying}
              path={props.path}
              className={
                compare(replying, props.path) && !minimized ? "" : "hidden"
              }
            />
            <div className={`comments ${minimized ? "hidden" : ""}`}>
              {gen_comments(props.comments, props.colorindex + 1, [
                ...props.path
              ])}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Comment = styled(Comment)`
  display: flex;
  text-align: left;
  background: ${props => (props.colorindex % 2 === 0 ? "#161C21" : "#13181D")};
  padding: 16px 16px 16px 12px;
  border: 0.1px solid #3d4953;
  border-radius: 8px;

  #showMore {
    background: none;
    border: none;
    color: #53626f;
    cursor: pointer;
    font-size: 13px;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }

  .comments {
    > * {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0px;
      }
    }

    &.hidden {
      display: none;
    }
  }

  #left {
    text-align: center;
    &.hidden {
      visibility: hidden;
      height: 0;
    }
  }

  #right {
    flex-grow: 1;

    #top {
      .minimize {
        cursor: pointer;
        color: #53626f;

        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
      }

      #username {
        color: #4f9eed;
      }

      #date {
        display: inline-block;
        color: #53626f;
      }

      > * {
        margin-right: 8px;
      }
    }

    #content {
      color: #cccccc;

      &.hidden {
        display: none;
      }
    }

    #actions {
      color: #53626f;
      margin-bottom: 12px;

      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

      &.hidden {
        display: none;
      }

      > .selected {
        font-weight: bold;
      }

      > * {
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }

  ${Reply} {
    margin-bottom: 12px;
  }
`;

function Comments(props) {
  var [replying, setReplying] = useState([]);
  var [comments, setComments] = useState([
    {
      username: "Ravindra",
      date: "3 hours ago",
      text: "This is dummy post",
      comments: [
        {
          username: "RJ",
          date: "2 hours ago",
          text: "This is dummmy Comment",
          comments: [
          ]
        },
        {
          username: "Ravi",
          date: "4 hours ago",
          text: "This is dummmy Comment",
          comments: []
        },
        {
          username: "RJ",
          date: "4 hours ago",
          text: "This is dummmy Comment",
          comments: []
        },
        {
          username: "Ravi",
          date: "10 mins ago",
          text: "this ",
          comments: [
            {
              username: "RJ",
              date: "8 mins ago",
              text: "is",
              comments: [
                {
                  username: "RJ",
                  date: "5 mins ago",
                  text: "to",
                  comments: [
                    {
                      username: "RJ",
                      date: "4 mins ago",
                      text: "show",
                      comments: [
                        {
                          username: "RJ",
                          date: "2 mins ago",
                          text: "nested comments",
                          comments: []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  return (
    <Card {...props}>
      <CommentContext.Provider value={{replyingKey: [replying, setReplying], commentsKey: [comments, setComments]}}>
        {gen_comments(comments, 0, [])}
      </CommentContext.Provider>
    </Card>
  );
}

export default styled(Comments)`
  max-width: 750px;
  min-width: min-content;

  > * {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  #comments,
  #comments_count {
    font-weight: 900;
    font-size: 20px;
    display: inline-block;
    margin-right: 4px;
    margin-bottom: 8px;
  }

  #comments {
    color: #ffffff;
  }

  #comments_count {
    color: #53626f;
  }
`;