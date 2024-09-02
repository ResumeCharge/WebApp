import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatePortfolio from "./components/pages/createPortfolio/createPortfolio";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PreviewPortfolio from "./components/pages/reviewPortfolioInformation/previewPortfolio";
import Account from "./components/pages/account/account";
import Templates from "./components/pages/templates/templates";
import Deployment from "./components/pages/deployment/deployment";
import { ManageAccount } from "./components/pages/account/manageAccount/manageAccount";
import FAQ from "./components/pages/FAQ/faq";
import About from "./components/pages/about/about";
import faqItems from "./components/pages/FAQ/faq-items";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/account" element={<Account />} />
          <Route path="/account/settings" element={<ManageAccount />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ faqItems={faqItems} />} />
          <Route
            path="/createportfolio/review"
            element={<PreviewPortfolio />}
          />
          <Route path="/createportfolio" element={<CreatePortfolio />} />
          <Route path="/website/deploy" element={<Deployment />} />
          <Route path="*" element={<Account />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
