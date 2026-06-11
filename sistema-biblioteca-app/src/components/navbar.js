import React from "react";
import "bootswatch/dist/flatly/bootstrap.css";

import NavbarItem from "./navbarItem";

function Navbar(props) {
  return (
    <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
      <div className="container">
        <a href="/" className="navbar-brand">
          Sistema de Biblioteca
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarResponsive"
        >
          <ul className="navbar-nav me-auto">

            {/* Clientes */}
            <NavbarItem
              render="true"
              href="/listagem-clientes"
              label="Clientes"
            />

            {/* Regras de Circulação */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/#"
                id="regrasDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Regras de Circulação
              </a>

              <ul
                className="dropdown-menu"
                aria-labelledby="regrasDropdown"
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-valorDiarioMultas"
                  >
                    Valor para Multas
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-duracaoPadraoEmprestimos"
                  >
                    Duração de Empréstimos
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-duracaoPadraoReservas"
                  >
                    Duração de Reservas
                  </a>
                </li>
              </ul>
            </li>

            {/* Classificações */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/#"
                id="classificacoesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Classificações
              </a>

              <ul
                className="dropdown-menu"
                aria-labelledby="classificacoesDropdown"
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-autores"
                  >
                    Autores
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-idiomas"
                  >
                    Idiomas
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-editoras"
                  >
                    Editoras
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-generos"
                  >
                    Gêneros
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/listagem-secoes"
                  >
                    Seções
                  </a>
                </li>
              </ul>
            </li>

            {/* Obras */}
            <NavbarItem
              render="true"
              href="/listagem-obras"
              label="Obras"
            />

            {/* Relatórios */}
            <NavbarItem
              render="true"
              href="/relatorios"
              label="Relatórios"
            />

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;