import React from 'react';
import "bootswatch/dist/flatly/bootstrap.css";

function NavbarItem({ render, label, href, onClick, dropdown, items = [] }) {
  if (!render) return null;

  if (dropdown) {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {label}
        </a>

        <ul className="dropdown-menu">
          {items.map((item) => (
            <li key={item.href}>
              <a className="dropdown-item" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <a onClick={onClick} className="nav-link" href={href}>
        {label}
      </a>
    </li>
  );
}

export default NavbarItem;
