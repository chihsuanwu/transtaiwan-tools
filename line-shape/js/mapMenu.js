
function createAddMenu() {
    
    class AddMenu extends google.maps.OverlayView {

        div;
        divListener;

        constructor() {
            super();
            this.div = document.createElement("div");
            this.div.className = "add-delete-menu";
            this.div.innerHTML = "Add";

            this.div.addEventListener("click", () => {
                const onAdd = this.get("onAddClick");
                onAdd();
            });
        }

        onAdd() {
            const deleteMenu = this;
            const map = this.getMap();
            this.getPanes().floatPane.appendChild(this.div);
            // mousedown anywhere on the map except on the menu div will close the
            // menu.
            this.divListener = map.getDiv().addEventListener(
                "mousedown", 
                (e) => {
                    if (e.target != deleteMenu.div) {
                        deleteMenu.close();
                    }
                },
                true
            );
        }

        onRemove() {
            if (this.divListener) {
                google.maps.event.removeListener(this.divListener);
            }
            this.div.parentNode.removeChild(this.div);
            // clean up
            this.set("position", null);
            this.set("line", null);
        }

        close() {
            this.setMap(null);
        }

        draw() {
            const position = this.get("position");
            const projection = this.getProjection();
        
            if (!position || !projection) {
              return;
            }
            const point = projection.fromLatLngToDivPixel(position);
            
            this.div.style.top = point.y + "px";
            this.div.style.left = point.x + "px";
        }
        /**
         * Opens the menu at a vertex of a given path.
         */
        open(map, position, onAdd) {
            this.set("position", position);
            this.set("onAddClick", onAdd);
            this.setMap(map);
            this.draw();
        }
    }

    return new AddMenu();
}

function createDeleteMenu() {

    class DeleteMenu extends google.maps.OverlayView {
        div;
        divListener;
        constructor() {
            super();
            this.div = document.createElement("div");
            this.div.className = "add-delete-menu";
            this.div.innerHTML = "Delete";
            this.div.addEventListener("click", () => {
                const onDelete = this.get("onDeleteClick");
                onDelete();
            });
        }

        onAdd() {
            const deleteMenu = this;
            const map = this.getMap();
            this.getPanes().floatPane.appendChild(this.div);
            // mousedown anywhere on the map except on the menu div will close the
            // menu.
            this.divListener = map.getDiv().addEventListener(
                "mousedown", 
                (e) => {
                    if (e.target != deleteMenu.div) {
                        deleteMenu.close();
                    }
                },
                true
            );
        }

        onRemove() {
            if (this.divListener) {
                google.maps.event.removeListener(this.divListener);
            }
            this.div.parentNode.removeChild(this.div);
            // clean up
            this.set("position", null);
        }

        close() {
            this.setMap(null);
        }
        draw() {
            const position = this.get("position");
            const projection = this.getProjection();
        
            if (!position || !projection) {
                return;
            }
            const point = projection.fromLatLngToDivPixel(position);
            
            this.div.style.top = point.y + "px";
            this.div.style.left = point.x + "px";
        }

        /**
         * Opens the menu at a vertex of a given path.
         */
        open(map, position, onDelete) {
            this.set("position", position);
            this.set("onDeleteClick", onDelete);
            this.setMap(map);
            this.draw();
        }
    }

    return new DeleteMenu();
}
