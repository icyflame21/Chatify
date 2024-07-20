import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from 'components/footer/Footer';
import classNames from 'classnames';
import NavbarTop from 'components/navbar/NavbarTop';

const MainLayout = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  return (
  
        <div className='container-fluid bg-200'>
          <div className={classNames('content')}>
            <NavbarTop />
            <Outlet />
            <Footer />
          </div>
        </div>
  );
};

export default MainLayout;
