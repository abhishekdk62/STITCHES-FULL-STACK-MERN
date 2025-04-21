import React, { useState } from "react";
import Main from "./elements/Main";
import Prods from "./elements/Prods";

const Offers = () => {
  const [tab, setTab] = useState("main");
  const [selectedCatId, setSelectedCatId] = useState("");

  return (
    <div>
      {tab === "main" && <Main setTab={setTab} setSelectedCatId={setSelectedCatId} />}
      {tab === "prods" && <Prods setTab={setTab} selectedCatId={selectedCatId} />}
    </div>
  );
};

export default Offers;