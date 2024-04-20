import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/home/home";
import About from "./components/pages/about/about";
import CreatePortfolio from "./components/pages/createPortfolio/createPortfolio";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PreviewPortfolio from "./components/pages/reviewPortfolioInformation/previewPortfolio";
import Account from "./components/pages/account/account";
import FAQ from "./components/pages/FAQ/faq";
import Templates from "./components/pages/templates/templates";
import ContactUs from "./components/pages/contactUs/contactUs";
import GuardedRoute from "./utilities/routeGuards/guardedRoute";
import SignIn from "./components/pages/users/signIn/signIn";
import SignUp from "./components/pages/users/signUp/signUp";
import Deployment from "./components/pages/deployment/deployment";
import { ManageAccount } from "./components/pages/account/manageAccount/manageAccount";
import { ForgotPassword } from "./components/pages/users/forgotPassword/forgotPassword";
import faqItems from "./components/pages/FAQ/faq-items";
import UserAlreadySignedInGuard from "./utilities/routeGuards/userAlreadySignedInGuard";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route element={<UserAlreadySignedInGuard />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route element={<GuardedRoute />}>
            <Route path="/account" element={<Account />} />
            <Route path="/account/oauth" element={<Account />} />
            <Route path="/account/settings" element={<ManageAccount />} />
          </Route>
          <Route path="/faq" element={<FAQ faqItems={faqItems} />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route
            path="/createportfolio/review"
            element={<PreviewPortfolio />}
          />
          <Route path="/createportfolio" element={<CreatePortfolio />} />
          <Route path="/website/deploy" element={<Deployment />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
