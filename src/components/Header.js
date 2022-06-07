import React from "react";

const Header = () => {
  return (
    <header className="app-header">
      <h1 className="app-header-title">Find the Narwhals</h1>
      <section className="app-header-game-info">
        <p className="game-info-narwhals-remaining">Narwhal's left</p>
        <p className="game-info-timer">Timer: </p>
      </section>
    </header>
  );
};

export default Header;
