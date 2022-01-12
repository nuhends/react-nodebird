import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

// 첫 번째 게시글 #해시태크 #익스프레스
const PostCardContent = ({ postData }) => {
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if(v.match(/(#[^\s#]+)/)) {
          return (
            <Link
              key={`keywordLink${i}`}
              href={`/hashtag/${v.slice(1)}`}
            >
              <a>{v}</a>
            </Link>
          )
        }

        return v;
      })}
    </div>
  )
}

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
}

export default PostCardContent
