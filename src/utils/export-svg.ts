import { saveAs } from "file-saver";

export const exportSvg = (_svg: HTMLElement) => {
  //   const xmlns = "http://www.w3.org/2000/xmlns/";
  //   const xlinkns = "http://www.w3.org/1999/xlink";
  //   const svgns = "http://www.w3.org/2000/svg";
  //   svg = svg.cloneNode(true);
  //   const fragment = window.location.href + "#";
  //   const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT);
  //   while (walker.nextNode()) {
  //     for (const attr of walker.currentNode.attributes) {
  //       if (attr.value.includes(fragment)) {
  //         attr.value = attr.value.replace(fragment, "#");
  //       }
  //     }
  //   }
  //   svg.setAttributeNS(xmlns, "xmlns", svgns);
  //   svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
  //   const serializer = new window.XMLSerializer();
  //   const string = serializer.serializeToString(svg);
  //   return new Blob([string], { type: "image/svg+xml" });

  
//   _svg.getElementsByClassName("selectorBox")
  
//   const html = svg
//     .attr("title", "test2")
//     .attr("version", 1.1)
//     .attr("xmlns", "http://www.w3.org/2000/svg")
//     .node().parentNode.innerHTML;

    const html = _svg.parentElement?.innerHTML
    if (html){
        const blob = new Blob([html], { type: "image/svg+xml" });
        console.log();
        saveAs(blob, "aaa.svg");

    }
};
