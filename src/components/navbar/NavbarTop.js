import React, { useContext, useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import classNames from 'classnames';
import AppContext from 'context/Context';
import Logo from 'components/common/Logo';
import TopNavRightSideNavItem from './TopNavRightSideNavItem';

const NavbarTop = () => {
  const {
    config: { showBurgerMenu },
    setConfig,
  } = useContext(AppContext);

  const [showDropShadow, setShowDropShadow] = useState(false);

  const handleBurgerMenu = () => {
    setConfig('showBurgerMenu', !showBurgerMenu);
  };

  const setDropShadow = () => {
    const el = document.documentElement;
    if (el.scrollTop > 0) {
      setShowDropShadow(true);
    } else {
      setShowDropShadow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', setDropShadow);
    return () => window.removeEventListener('scroll', setDropShadow);
  }, []);

  return (
    <Navbar
      className={classNames('navbar-glass  fs--1 navbar-top sticky-kit mb-1  bg-200', {
        'navbar-glass-shadow': showDropShadow
      })}
      expand={true}
    >
      <Navbar.Toggle
        className={classNames('toggle-icon-wrapper me-md-3 me-2')}
        as="div"
      >
        <button
          className="navbar-toggler-humburger-icon btn btn-link d-flex flex-center"
          onClick={handleBurgerMenu}
          id="burgerMenu"
        >
          <span className="navbar-toggle-icon">
            <span className="toggle-line" />
          </span>
        </button>
      </Navbar.Toggle>
      <Logo at="navbar-top" width={160} id="topLogo" />

      <TopNavRightSideNavItem />
    </Navbar>
  );
};

export default NavbarTop;
