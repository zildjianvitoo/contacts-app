import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ContactList from "../components/ContactList";
import SearchBar from "../components/SearchBar";
import { deleteContact } from "../utils/api";
import { getContacts } from "../utils/api";
import LocaleContext from "../contexts/LocaleContext";

function HomePageWrapper() {
  return (
    <HomePage defaultKeyword={keyword} keywordChange={changeSearchParams} />
  );
}

function HomePage(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") || ""
  );
  const { locale } = useContext(LocaleContext);

  useEffect(() => {
    async function fetchContactsHandler() {
      const { data } = await getContacts();
      setContacts(data);
    }
    fetchContactsHandler();
  }, []);

  async function onDeleteHandler(id) {
    await deleteContact(id);
    const { data } = await getContacts();
    setContacts(data);
  }

  function onKeywordChangeHandler(keyword) {
    setKeyword(keyword);
    setSearchParams({ keyword });
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <section>
      <h2>{locale === "id" ? "Daftar Kontak" : "Contacts List"}</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      <ContactList contacts={filteredContacts} onDelete={onDeleteHandler} />
    </section>
  );
}
