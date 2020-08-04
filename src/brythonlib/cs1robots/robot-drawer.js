export default class RobotDrawer {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.walls = {};
        this.agents = {};
        this.markers = {};
        this.gridCells = {};
        this.taskQueue = [];
        this.initWorldElement();
    }

    initWorldElement() {
        this.worldElement = document.createElement('div');
        this.worldElement.className = 'cocode-robot-drawer__world';
        this.containerElement.appendChild(this.worldElement);
        return this.worldElement;
    }

    setWorldSize(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
        this.cellWidthPercentage = 100 / width;
        this.cellHeightPercentage = 100 / height;
        this.initGridCells();
        this.resize();
    }

    setWorldElementSize(width, height, marginTop) {
        this.worldElement.style.width = `${width}px`;
        this.worldElement.style.height = `${height}px`;
        this.containerElement.style.paddingTop = `${marginTop}px`;
    }

    initGridCells() {
        this.gridCells = {};
        this.gridElement = document.createElement('div');
        this.gridElement.className = 'cocode-robot-drawer__world-grid';
        this.worldElement.appendChild(this.gridElement);
        for (let i = this.worldHeight - 1; i >= 0; i--) {
            this.gridCells[i] = {};
            const rowElement = document.createElement('div');
            rowElement.className = 'cocode-robot-drawer__world-grid-row';
            rowElement.style.width = '100%';
            rowElement.style.height = `${this.cellHeightPercentage}%`;
            this.gridElement.appendChild(rowElement);
            for (let j = 0; j < this.worldWidth; j++) {
                const cellElement = document.createElement('div');
                this.gridCells[i][j] = cellElement;
                cellElement.className = 'cocode-robot-drawer__world-grid-cell';
                cellElement.style.width = `${this.cellWidthPercentage}%`;
                cellElement.style.height = '100%';
                rowElement.appendChild(cellElement);
            }
        }
    }

    resize() {
        const containerWidth = this.containerElement.offsetWidth;
        const containerHeight = this.containerElement.offsetHeight;
        const cellSizeForWidthFit = containerWidth / this.worldWidth;
        const worldHeightForWidthFit = cellSizeForWidthFit * this.worldHeight;
        if (containerHeight > worldHeightForWidthFit) {
            this.scaleWorldWidthFit(containerWidth, containerHeight);
        } else {
            this.scaleWorldHeightFit(containerWidth, containerHeight);
        }
    }

    scaleWorldWidthFit(containerWidth, containerHeight) {
        const worldWidthPixels = containerWidth;
        const worldCellSize = worldWidthPixels / this.worldWidth;
        const worldHeightPixels = worldCellSize * this.worldHeight;
        const worldMarginTop = (containerHeight - worldHeightPixels) / 2;
        this.setWorldElementSize(worldWidthPixels, worldHeightPixels, worldMarginTop);
    }

    scaleWorldHeightFit(containerWidth, containerHeight) {
        const worldHeightPixels = containerHeight;
        const worldCellSize = worldHeightPixels / this.worldHeight
        const worldWidthPixels = worldCellSize * this.worldWidth;
        this.setWorldElementSize(worldWidthPixels, worldHeightPixels, 0);
    }

    getCoordinatePercentage(x, y) {
        return {
            x: this.cellWidthPercentage * x,
            y: this.cellHeightPercentage * (this.worldHeight - y - 1),
        };
    }

    drawWall(x, y, direction) {
        const coordinate = this.getCoordinatePercentage(x, y);
        const wallElement = document.createElement('div');
        wallElement.className = [
            'cocode-robot-drawer__wall',
            `cocode-robot-drawer__wall--${direction}`,
        ].join(' ');
        const isVertical = direction === 'vertical';
        if (isVertical) {
            wallElement.style.height = `${this.cellHeightPercentage}%`;
        } else {
            wallElement.style.width = `${this.cellWidthPercentage}%`;
        }
        wallElement.style.left = `${coordinate.x}%`;
        wallElement.style.top = `${coordinate.y}%`;
        this.worldElement.appendChild(wallElement);
        this.walls[`${direction},${x},${y}`] = {
            direction: direction,
            x: x,
            y: y,
            element: wallElement,
        };
    }

    drawAgent(agent) {
        const coordinate = this.getCoordinatePercentage(agent.x, agent.y);
        const agentElement = document.createElement('div');
        agentElement.className = [
            'cocode-robot-drawer__agent',
            `cocode-robot-drawer__agent--type-${agent.agentType}`,
            `cocode-robot-drawer__agent--direction-${agent.direction}`,
        ].join(' ');
        agentElement.style.width = `${this.cellWidthPercentage}%`;
        agentElement.style.height = `${this.cellHeightPercentage}%`;
        agentElement.style.left = `${coordinate.x}%`;
        agentElement.style.top = `${coordinate.y}%`;
        this.worldElement.appendChild(agentElement);
        this.agents[agent.id] = {
            ...agent,
            element: agentElement,
            traceElements: [],
        };
    }

    removeAgent(agentId) {
        this.worldElement.removeChild(this.agents[agentId].element);
        for (const traceElement of this.agents[agentId].traceElements) {
            this.worldElement.removeChild(traceElement);
        }
        delete this.agents[agentId];
    }

    drawAgentTrace(agent, x1, y1, x2, y2) {
        const traceElements = this.agents[agent.id].traceElements;
        const isVertical = x1 === x2;
        let direction = null;
        let coordinate = null;
        
        const traceElement = document.createElement('div');
        if (isVertical) {
            direction = y1 > y2 ? 's' : 'n';
            coordinate = this.getCoordinatePercentage(x1, Math.max(y1, y2));
            traceElement.style.height = `${this.cellHeightPercentage}%`;
        } else {
            direction = x1 > x2 ? 'w' : 'e';
            coordinate = this.getCoordinatePercentage(Math.min(x1, x2), y1);
            traceElement.style.width = `${this.cellWidthPercentage}%`;
        }
        traceElement.className = [
            'cocode-robot-drawer__agent-trace',
            'cocode-robot-drawer__agent-trace--invisible',
            `cocode-robot-drawer__agent-trace--direction-${direction}`,
        ].join(' ');
        
        traceElement.style.left = `${coordinate.x + (this.cellWidthPercentage / 2)}%`;
        traceElement.style.top = `${coordinate.y + (this.cellHeightPercentage / 2)}%`;
        traceElement.style.borderColor = agent.traceColor || 'transparent';
        this.worldElement.appendChild(traceElement);
        setTimeout(() => traceElement.classList.remove('cocode-robot-drawer__agent-trace--invisible'), 100);
        traceElements.push(traceElement);
    }

    drawAgentRotateTrace(agent, direction1, direction2) {
        const traceElements = this.agents[agent.id].traceElements;
        const coordinate = this.getCoordinatePercentage(agent.x, agent.y);
        const traceElement = document.createElement('div');
        traceElement.className = [
            'cocode-robot-drawer__agent-trace',
            'cocode-robot-drawer__agent-trace--invisible',
            `cocode-robot-drawer__agent-trace--direction-${direction1}${direction2}`,
        ].join(' ');
        traceElement.style.left = `${coordinate.x + (this.cellWidthPercentage / 2)}%`;
        traceElement.style.top = `${coordinate.y + (this.cellHeightPercentage / 2)}%`;
        traceElement.style.borderColor = agent.traceColor || 'transparent';
        this.worldElement.appendChild(traceElement);
        setTimeout(() => traceElement.classList.remove('cocode-robot-drawer__agent-trace--invisible'), 100);
        traceElements.push(traceElement);
    }

    moveAgent(agent) {
        const coordinate = this.getCoordinatePercentage(agent.x, agent.y);
        const agentElement = this.agents[agent.id].element;
        agentElement.style.left = `${coordinate.x}%`;
        agentElement.style.top = `${coordinate.y}%`;
        this.drawAgentTrace(
            agent,
            this.agents[agent.id].x, 
            this.agents[agent.id].y,
            agent.x,
            agent.y,
        );
        this.agents[agent.id] = {
            ...this.agents[agent.id],
            x: agent.x,
            y: agent.y,
        };
    }

    rotateAgent(agent) {
        const agentElement = this.agents[agent.id].element;
        agentElement.className = [
            'cocode-robot-drawer__agent',
            `cocode-robot-drawer__agent--type-${agent.agentType}`,
            `cocode-robot-drawer__agent--direction-${agent.direction}`,
        ].join(' ');
        this.drawAgentRotateTrace(
            agent,
            this.agents[agent.id].direction,
            agent.direction,
        );
        this.agents[agent.id] = {
            ...this.agents[agent.id],
            direction: agent.direction,
        };
    }

    getMarkerKey(marker) {
        return `${marker.markerType},${marker.x},${marker.y}`;
    }

    initMarkerCell(marker) {
        const cellSize = this.worldElement.offsetWidth / this.worldWidth;
        const markerKey = this.getMarkerKey(marker);
        if (!this.markers[markerKey]) {
            const coordinate = this.getCoordinatePercentage(marker.x, marker.y);

            const markerElement = document.createElement('div');
            markerElement.className = [
                'cocode-robot-drawer__marker',
                `cocode-robot-drawer__marker--type-${marker.markerType}`,
                `cocode-robot-drawer__marker--invisible`,
            ].join(' ');
            markerElement.style.width = `${this.cellWidthPercentage}%`;
            markerElement.style.height = `${this.cellHeightPercentage}%`;
            markerElement.style.left = `${coordinate.x}%`;
            markerElement.style.top = `${coordinate.y}%`;

            const markerLabelElement = document.createElement('div');
            markerLabelElement.className = 'cocode-robot-drawer__marker-label';
            markerLabelElement.style.fontSize = `${cellSize * 0.45 * 0.0625}rem`;
            markerElement.appendChild(markerLabelElement);

            this.worldElement.appendChild(markerElement);
            this.markers[markerKey] = {
                markers: [],
                element: markerElement,
                labelElement: markerLabelElement,
            };
        }
        return markerKey;
    }

    drawMarker(marker) {
        const markerKey = this.initMarkerCell(marker);
        const markers = this.markers[markerKey].markers;
        const markerElement = this.markers[markerKey].element;
        const markerLabelElement = this.markers[markerKey].labelElement;
        markers.push(marker);
        markerElement.classList.remove('cocode-robot-drawer__marker--invisible');
        markerLabelElement.innerHTML = markers.length >= 1 ? markers.length : '';
    }

    removeMarker(marker) {
        const markerKey = this.getMarkerKey(marker);
        const markerCell = this.markers[markerKey];
        if (!markerCell) {
            return;
        }
        markerCell.markers = markerCell.markers.filter(m => m.id !== marker.id);
        if (markerCell.markers.length === 0) {
            markerCell.element.classList.add('cocode-robot-drawer__marker--invisible');
        }
        markerCell.labelElement.innerHTML = markerCell.markers.length > 1 ? markerCell.markers.length : '';
    }

    taskToAgent(task) {
        return {
            id: task.id,
            agentType: task.agent_type,
            x: task.x,
            y: task.y,
            direction: task.direction,
            traceColor: task.trace_color,
        };
    }

    taskToMarker(task) {
        return {
            id: task.id,
            markerType: task.marker_type,
            x: task.x,
            y: task.y,
        };
    }

    onDrawWorld(task) {
        this.setWorldSize(task.width, task.height);
    }

    onDrawWall(task) {
        if (task.x1 === task.x2) {
            if (Math.abs(task.y1 - task.y2) === 1) {
                this.drawWall(task.x1, Math.min(task.y1, task.y2), 'horizontal');
            }
        } else if (task.y1 === task.y2) {
            if (Math.abs(task.x1 - task.x2) === 1) {
                this.drawWall(Math.max(task.x1, task.x2), task.y1, 'vertical');
            }
        }
    }

    onDrawPiece(task) {
        if (task.piece_type === 'agent') {
            this.drawAgent(this.taskToAgent(task));
        } else if (task.piece_type === 'marker') {
            this.drawMarker(this.taskToMarker(task));
        }
    }

    onRemovePiece(task) {
        if (task.piece_type === 'agent') {
            this.removeAgent(task.id);
        } else if (task.piece_type === 'marker') {
            this.removeMarker(this.taskToMarker(task));
        }
    }

    onMovePiece(task) {
        if (task.piece_type === 'agent') {
            this.moveAgent(this.taskToAgent(task));
        }
    }

    onRotatePiece(task) {
        if (task.piece_type === 'agent') {
            this.rotateAgent(this.taskToAgent(task));
        }
    }

    onTask(task) {
        this.processTask(task);
    }

    processTask(task) {
        switch (task.task) {
            case 'draw_world':
                this.onDrawWorld(task);
                break;

            case 'draw_wall':
                this.onDrawWall(task);
                break;

            case 'draw_piece':
                this.onDrawPiece(task);
                break;

            case 'remove_piece':
                this.onRemovePiece(task);
                break;

            case 'move_piece':
                this.onMovePiece(task);
                break;

            case 'rotate_piece':
                this.onRotatePiece(task);
                break;

            default:
                break;
        }
    }
}