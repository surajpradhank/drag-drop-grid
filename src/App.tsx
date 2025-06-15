import React, { useState } from "react";
import ReactGridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

type Item = { id: string; content: string };

const initialA: Item[] = [
  { id: "a1", content: "A Item 1" },
  { id: "a2", content: "A Item 2" },
];

const initialB: Item[] = [
  { id: "b1", content: "B Item 1" },
  { id: "b2", content: "B Item 2" },
  { id: "b3", content: "B Item 3" },
  { id: "b4", content: "B Item 4" },
  { id: "b5", content: "B Item 5" },
  { id: "b6", content: "B Item 6" },
];

const App: React.FC = () => {
  const [gridAItems, setGridAItems] = useState<Item[]>(initialA);
  const [gridBItems, setGridBItems] = useState<Item[]>(initialB);

  const handleExternalDrop = (e: React.DragEvent, target: "A" | "B") => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const item: Item = JSON.parse(data);

    if (target === "A" && !gridAItems.find((i) => i.id === item.id)) {
      setGridBItems((prev) => prev.filter((i) => i.id !== item.id));
      setGridAItems((prev) => [...prev, item]);
    }
    if (target === "B" && !gridBItems.find((i) => i.id === item.id)) {
      setGridAItems((prev) => prev.filter((i) => i.id !== item.id));
      setGridBItems((prev) => [...prev, item]);
    }
  };

  const handleExternalDragStart = (e: React.DragEvent, item: Item) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const layoutA: Layout[] = gridAItems.map((item, index) => ({
    i: item.id,
    x: (index % 2) * 3,
    y: Math.floor(index / 2),
    w: 3,
    h: 2,
  }));

  return (
    <div style={{ display: "flex", gap: 50 }}>
      {/* Grid A */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleExternalDrop(e, "A")}
        style={{
          border: "1px solid gray",
          padding: "10px",
          width: "50%",
          minHeight: "400px",
        }}
      >
        <h3>Grid A (Resizable + Internal Drag)</h3>
        <ReactGridLayout
          className="layout"
          layout={layoutA}
          cols={6}
          rowHeight={50}
          width={500}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".internal-drag-handle" // <-- important
        >
          {gridAItems.map((item) => (
            <div
              key={item.id}
              style={{ border: "1px solid black", position: "relative" }}
            >
              {/* Internal drag handle */}
              <div
                className="internal-drag-handle"
                style={{
                  padding: "5px",
                  background: "red",
                  cursor: "move",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {item.content}
              </div>

              {/* External drag handle */}
              <div
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  background: "#ccc",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  textAlign: "center",
                  cursor: "grab",
                }}
                draggable
                onDragStart={(e) => handleExternalDragStart(e, item)}
              >
                ⇅
              </div>
            </div>
          ))}
        </ReactGridLayout>
      </div>

      {/* Grid B */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleExternalDrop(e, "B")}
        style={{
          border: "1px solid gray",
          padding: "10px",
          width: "50%",
          minHeight: "400px",
        }}
      >
        <h3>Grid B (No Resize)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {gridBItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleExternalDragStart(e, item)}
              style={{
                border: "1px solid black",
                padding: "10px",
                width: "100px",
                height: "100px",
                cursor: "move",
                background: "#fff",
              }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
