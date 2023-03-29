import React from "react";
import HomePage from "../pages/HomePage";
import AddPage from "../pages/AddPage";
import Navigation from "./Navigation";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import { getUserLogged, putAccessToken } from "../utils/api";
import { LocalProvider } from "../contexts/LocaleContext";

class ContactApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authedUser: null,
      initializing: true,
      localeContext: {
        locale: localStorage.getItem("locale") || "id",
        toggleLocale: () => {
          this.setState((prevState) => {
            const newLocale =
              prevState.localeContext.locale === "id" ? "en" : "id";
            localStorage.setItem("locale", newLocale);
            return {
              localeContext: {
                ...prevState.localeContext,
                locale: newLocale,
              },
            };
          });
        },
      },
    };

    this.onLoginSucces = this.onLoginSucces.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  async onLoginSucces({ accessToken }) {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    this.setState(() => {
      return {
        authedUser: data,
      };
    });
  }

  async componentDidMount() {
    const { data } = await getUserLogged();
    this.setState(() => {
      return {
        authedUser: data,
        initializing: false,
      };
    });
  }

  onLogout() {
    this.setState(() => {
      return {
        authedUser: null,
      };
    });

    putAccessToken("");
  }

  render() {
    if (this.state.initializing) {
      return null;
    }

    if (this.state.authedUser === null) {
      return (
        <LocalProvider value={this.state.localeContext}>
          <div className="contact-app">
            <header className="contact-app__header">
              <h1>
                {this.state.localeContext.locale === "id"
                  ? "Aplikasi Kontak"
                  : "Contacts App"}
              </h1>
            </header>
            <main>
              <Routes>
                <Route
                  path="/*"
                  element={<LoginPage loginSucces={this.onLoginSucces} />}
                />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
          </div>
        </LocalProvider>
      );
    }

    return (
      <LocalProvider value={this.state.localeContext}>
        <div className="contact-app">
          <header className="contact-app__header">
            <h1>
              {this.state.localeContext.locale === "id"
                ? "Aplikasi Kontak"
                : "Contacts App"}
            </h1>
            <Navigation
              logout={this.onLogout}
              name={this.state.authedUser.name}
            />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add" element={<AddPage />} />
            </Routes>
          </main>
        </div>
      </LocalProvider>
    );
  }
}

export default ContactApp;
