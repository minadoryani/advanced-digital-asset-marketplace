import { useState } from "react";
import { ethers } from "ethers";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

import "./App.css";

import { DIGITAL_ART_MARKET_ABI } from "./abi/DigitalArtMarketAbi.js";
import { MOCK_TOKEN_ABI } from "./abi/MockTokenAbi.js";
import {
  DIGITAL_ART_MARKET_ADDRESS,
  MOCK_TOKEN_ADDRESS
} from "./config/contracts.js";

function App() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Noch keine Transaktion ausgeführt.");

  const [title, setTitle] = useState("");
  const [uri, setUri] = useState("");

  const [sellArtId, setSellArtId] = useState("");
  const [sellPrice, setSellPrice] = useState("");

  const [buyArtId, setBuyArtId] = useState("");

  const [transferArtId, setTransferArtId] = useState("");
  const [newOwner, setNewOwner] = useState("");

  function getReadableError(error) {
    console.error("Vollständiger Fehler:", error);

    if (error?.info?.error?.message) return error.info.error.message;
    if (error?.error?.message) return error.error.message;
    if (error?.reason) return error.reason;
    if (error?.shortMessage) return error.shortMessage;
    if (error?.message) return error.message;

    try {
      return JSON.stringify(error);
    } catch {
      return "Unbekannter Fehler";
    }
  }

  function getInjectedProvider() {
    if (!window.ethereum) {
      throw new Error("MetaMask nicht installiert");
    }

    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const metaMaskProvider = window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );

      if (metaMaskProvider) {
        return metaMaskProvider;
      }
    }

    return window.ethereum;
  }

  async function switchToSepolia(providerObject) {
    const provider = new ethers.BrowserProvider(providerObject);
    const network = await provider.getNetwork();

    if (network.chainId === 11155111n) {
      return;
    }

    try {
      await providerObject.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
      });
    } catch (switchError) {
      throw new Error(
        "Bitte MetaMask wirklich auf Sepolia umstellen und danach die Seite neu laden."
      );
    }
  }

  async function connectWallet() {
    try {
      const injectedProvider = getInjectedProvider();

      await switchToSepolia(injectedProvider);

      const provider = new ethers.BrowserProvider(injectedProvider);
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setStatus("Wallet verbunden: " + accounts[0]);
    } catch (error) {
      setStatus("Wallet Verbindung fehlgeschlagen: " + getReadableError(error));
    }
  }

  async function getContracts() {
    const injectedProvider = getInjectedProvider();

    await switchToSepolia(injectedProvider);

    const provider = new ethers.BrowserProvider(injectedProvider);
    const signer = await provider.getSigner();

    const market = new ethers.Contract(
      DIGITAL_ART_MARKET_ADDRESS,
      DIGITAL_ART_MARKET_ABI,
      signer
    );

    const token = new ethers.Contract(
      MOCK_TOKEN_ADDRESS,
      MOCK_TOKEN_ABI,
      signer
    );

    return { provider, signer, market, token };
  }

  async function registerArt() {
    try {
      if (!title.trim()) {
        throw new Error("Titel darf nicht leer sein.");
      }

      if (!uri.trim()) {
        throw new Error("Metadata URI darf nicht leer sein.");
      }

      setStatus("Registriere Kunstwerk...");

      const { market } = await getContracts();

      const tx = await market.registerArt(title, uri, {
        gasLimit: 300000
      });

      setStatus("Transaktion gesendet: " + tx.hash);

      await tx.wait();

      setStatus("Kunstwerk erfolgreich registriert.");
      setTitle("");
      setUri("");
    } catch (error) {
      setStatus("Fehler beim Registrieren: " + getReadableError(error));
    }
  }

  async function listForSale() {
    try {
      if (sellArtId === "") {
        throw new Error("Bitte eine Art ID eingeben.");
      }

      if (!sellPrice.trim()) {
        throw new Error("Bitte einen Preis eingeben.");
      }

      setStatus("Biete Kunstwerk zum Verkauf an...");

      const { market } = await getContracts();
      const price = ethers.parseUnits(sellPrice, 18);

      const tx = await market.listArtForSale(sellArtId, price, {
        gasLimit: 300000
      });

      setStatus("Transaktion gesendet: " + tx.hash);

      await tx.wait();

      setStatus("Kunstwerk erfolgreich zum Verkauf angeboten.");
      setSellArtId("");
      setSellPrice("");
    } catch (error) {
      setStatus("Fehler beim Verkauf: " + getReadableError(error));
    }
  }

  async function buyArt() {
    try {
      if (buyArtId === "") {
        throw new Error("Bitte eine Art ID eingeben.");
      }

      setStatus("Kaufe Kunstwerk...");

      const { market, token } = await getContracts();

      const art = await market.getArtItem(buyArtId);
      const price = art.price;

      const approveTx = await token.approve(DIGITAL_ART_MARKET_ADDRESS, price, {
        gasLimit: 200000
      });

      setStatus("Approve gesendet: " + approveTx.hash);
      await approveTx.wait();

      const buyTx = await market.buyArt(buyArtId, {
        gasLimit: 400000
      });

      setStatus("Kauf-Transaktion gesendet: " + buyTx.hash);
      await buyTx.wait();

      setStatus("Kunstwerk erfolgreich gekauft.");
      setBuyArtId("");
    } catch (error) {
      setStatus("Fehler beim Kauf: " + getReadableError(error));
    }
  }

  async function transferOwnership() {
    try {
      if (transferArtId === "") {
        throw new Error("Bitte eine Art ID eingeben.");
      }

      if (!newOwner.trim()) {
        throw new Error("Bitte eine neue Adresse eingeben.");
      }

      setStatus("Übertrage Besitz...");

      const { market } = await getContracts();

      const tx = await market.transferArtOwnership(transferArtId, newOwner, {
        gasLimit: 300000
      });

      setStatus("Transfer-Transaktion gesendet: " + tx.hash);

      await tx.wait();

      setStatus("Besitz erfolgreich übertragen.");
      setTransferArtId("");
      setNewOwner("");
    } catch (error) {
      setStatus("Fehler bei Übertragung: " + getReadableError(error));
    }
  }

  return _jsxs("div", {
    className: "app",
    children: [
      _jsx("h1", { children: "Digital Art Marketplace DApp" }),

      _jsxs("section", {
        className: "card",
        children: [
          _jsx("h2", { children: "Wallet" }),
          _jsx("p", { children: account ? account : "Noch nicht verbunden" }),
          _jsx("button", {
            onClick: connectWallet,
            children: "Wallet verbinden"
          })
        ]
      }),

      _jsxs("section", {
        className: "card",
        children: [
          _jsx("h2", { children: "Kunstwerk registrieren" }),
          _jsx("input", {
            placeholder: "Titel",
            value: title,
            onChange: (e) => setTitle(e.target.value)
          }),
          _jsx("input", {
            placeholder: "Metadata URI",
            value: uri,
            onChange: (e) => setUri(e.target.value)
          }),
          _jsx("button", {
            onClick: registerArt,
            children: "Registrieren"
          })
        ]
      }),

      _jsxs("section", {
        className: "card",
        children: [
          _jsx("h2", { children: "Kunstwerk verkaufen" }),
          _jsx("input", {
            placeholder: "Art ID",
            value: sellArtId,
            onChange: (e) => setSellArtId(e.target.value)
          }),
          _jsx("input", {
            placeholder: "Preis (Token)",
            value: sellPrice,
            onChange: (e) => setSellPrice(e.target.value)
          }),
          _jsx("button", {
            onClick: listForSale,
            children: "Verkaufen"
          })
        ]
      }),

      _jsxs("section", {
        className: "card",
        children: [
          _jsx("h2", { children: "Kunstwerk kaufen" }),
          _jsx("input", {
            placeholder: "Art ID",
            value: buyArtId,
            onChange: (e) => setBuyArtId(e.target.value)
          }),
          _jsx("button", {
            onClick: buyArt,
            children: "Kaufen"
          })
        ]
      }),

      _jsxs("section", {
        className: "card",
        children: [
          _jsx("h2", { children: "Besitz übertragen" }),
          _jsx("input", {
            placeholder: "Art ID",
            value: transferArtId,
            onChange: (e) => setTransferArtId(e.target.value)
          }),
          _jsx("input", {
            placeholder: "Neue Adresse",
            value: newOwner,
            onChange: (e) => setNewOwner(e.target.value)
          }),
          _jsx("button", {
            onClick: transferOwnership,
            children: "Übertragen"
          })
        ]
      }),

      _jsxs("section", {
        className: "card",
        children: [
          _jsx("h2", { children: "Status" }),
          _jsx("p", { children: status })
        ]
      })
    ]
  });
}

export default App;
