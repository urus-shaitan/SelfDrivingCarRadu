class Visualizer {
    static drawNetwork(ctx, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin*2;
        const height = ctx.canvas.height - margin*2;

        // Visualizer.drawLevel(ctx, network.levels[0],
        //     left, top,
        //     width, height
        // );
        const levelHeight = height/network.levels.length;
        for(let i=network.levels.length-1; i>=0; i--){
          const levelTop = top + lerp(
            height-levelHeight,
            0,
            network.levels.length == 1 
              ? 0.5
              : i/(network.levels.length-1)
            );
          ctx.setLineDash([7,3]);
          Visualizer.drawLevel(ctx, network.levels[i],
            left, levelTop,
            width, levelHeight,
            i==network.levels.length-1
              ? ['🠉','🠈','🠊','🠋']
              : []
          );
        }
    }

    static drawLevel(ctx, level,
        left, top,
        width, height,
        outputLabels) {
      const {inputs, outputs, weights, biases} = level;
        const right = left + width;
      const bottom = top + height; 

      const nodeRadius = 18;

      for(let i=0; i< inputs.length; i++)
        for(let j=0; j< outputs.length; j++){
          ctx.beginPath();
          ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
          ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
          ctx.lineWidth = 2;
          ctx.strokeStyle = getRGBA(weights[i][j]);
          ctx.stroke();
        }
      
        for(let i=0; i< outputs.length; i++){
          const x = Visualizer.#getNodeX(outputs, i, left, right);;
  
          ctx.beginPath();
          ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
          ctx.strokeStyle = getRGBA(biases[i]);
          ctx.stroke();
        }

      for(let i=0; i< inputs.length; i++){
        const x = Visualizer.#getNodeX(inputs, i, left, right);

        ctx.beginPath();
        ctx.arc(x, bottom, nodeRadius *0.7, 0, Math.PI*2);
        ctx.fillStyle = getRGBA(inputs[i]);
        ctx.fill();
      }

      for(let i=0; i< outputs.length; i++){
        const x = Visualizer.#getNodeX(outputs, i, left, right);;

        ctx.beginPath();
        ctx.arc(x, top, nodeRadius * 0.7, 0, Math.PI*2);
        ctx.fillStyle = getRGBA(outputs[i]);;
        ctx.fill();

        if(outputLabels[i]) {
          ctx.beginPath();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "black";
          ctx.strokeStyle = "white";
          ctx.font = (nodeRadius*1.5)+"px Arial";
          ctx.fillText(outputLabels[i], x, top + nodeRadius*0.1);
          ctx.lineWidth = 0.5;
          ctx.strokeText(outputLabels[i], x, top + nodeRadius*0.1);
        }
      }
    }

    static #getNodeX(nodes, index, left, right){
      return lerp(left, right, 
        nodes.length == 1 ? 0.5 : index/(nodes.length - 1)
      );
    }
}