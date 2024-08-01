import React from 'react';
import Header from '../Header/Header';

function Layout({ isLoggedIn, onLogout, children }) {
  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;
