import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';

const ChatContentBodyIntro = ({ thread }) => (
  <Flex
    alignItems="center"
    className="position-relative p-3 border-bottom mb-3"
  >
    <Avatar className={`me-3`} size="2xl" src={thread?.chat_group_options?.group_image} />
    <div className="flex-1">
      <h6 className="mb-0 text-decoration-none stretched-link text-700">
        {thread?.chat_group_options?.group_name}
      </h6>
      <p className="mb-0">
        {thread?.chat_group_options?.group_heading}
      </p>
    </div>
  </Flex>
);

ChatContentBodyIntro.propTypes = {
  isGroup: PropTypes.bool,
  user: PropTypes.object.isRequired
};

export default ChatContentBodyIntro;
