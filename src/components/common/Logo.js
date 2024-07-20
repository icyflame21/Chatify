import React, { useContext } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import AppContext from 'context/Context';
import chatify from "assets/img/chatify.png"

const Logo = ({ at, width, className, textClass, ...rest }) => {

  const {
    config: { isDark },
  } = useContext(AppContext);

  return (
    <Link
      to={"/"}
      className={classNames(
        'text-decoration-none',
        { 'navbar-brand': at === 'navbar-top' }
      )}
      {...rest}
    >
      <div
        className={classNames(
          'd-flex',
          {
            'flex-center ': at === 'auth'
          },
          className
        )}
      >
        <img src={chatify} alt="chatify" width={width ? width : 250} height={at === 'auth' ? "auto" : 60} style={{ objectFit: "cover" }} />
      </div>
    </Link>
  );
};


export default Logo;
