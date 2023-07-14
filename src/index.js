import React from "react";
import ReactDOM from "react-dom";
import * as singleSpa from "single-spa";
import singleSpaReact from "single-spa-react";

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    singleSpa.navigateToUrl(e.target.href);
  });
});

const PageA = props => {
  const parcel1 = React.useRef(null);
  const parcel2 = React.useRef(null);

  React.useEffect(() => {
    const parcel1Root = parcel1.current;
    const parcel2Root = parcel2.current;
    props.mountParcel(parcelLifecycles, { domElement: parcel1Root, id: 1 });
    props.mountParcel(parcelLifecycles, { domElement: parcel2Root, id: 2 });
  }, [props]);
  return (
    <>
      <h1>Page A</h1>
      <div ref={parcel1} />
      <div ref={parcel2} />
    </>
  );
};

const PageB = () => <h1>Page B</h1>;

const Parcel = props => {
  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log(`interval of parcel ${props.id} ticking...`);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [props.id]);
  return <div>I am a parcel</div>;
};

const pageALifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: PageA,
  suppressComponentDidCatchWarning: true,
  domElementGetter: () => document.getElementById("root")
});

const pageBLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: PageB,
  suppressComponentDidCatchWarning: true,
  domElementGetter: () => document.getElementById("root")
});

const parcelLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Parcel,
  suppressComponentDidCatchWarning: true
});

singleSpa.registerApplication(
  "page A",
  pageALifecycles,
  location => location.pathname === "/"
);

singleSpa.registerApplication(
  "page B",
  pageBLifecycles,
  location => location.pathname === "/pageb"
);

singleSpa.start();
