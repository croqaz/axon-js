(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (factory((global.Axon = {})));
}(this, (function (exports) { 'use strict';

   /**
    * Basic 2D Matrix math class
    */

   class Mx {
       constructor(rows, cols) {
           this.rows = rows;
           this.cols = cols;
           this.array = Array(rows * cols).fill(0);
       }

       static fromArray(arr) {
           let rows = arr.length;
           let cols = arr[0].length;
           let matrix = new Mx(rows, cols);

           for (let row = 0; row < rows; row++) {
               for (let col = 0; col < cols; col++) {
                   matrix.array[row * cols + col] = arr[row][col];
               }
           }
           return matrix
       }

       static fromDims(rows, cols) {
           return new Mx(rows, cols)
       }

       fill(num) {
           this.array.fill(num);
       }

       toString(digits) {
           let result = "";
           let max_length = 0;
           let number_strs = [];

           for (let i = 0; i < this.rows * this.cols; i++) {
               let str = this.array[i].toFixed(digits);
               if (str.length > max_length) {
                   max_length = str.length;
               }
               number_strs.push(str);
           }

           for (let i = 0; i < this.rows * this.cols; i++) {
               if (i % this.cols == 0) {
                   result += "\n";
               }
               result += number_strs[i].padStart(max_length) + "  ";
           }
           return result
       }

       toArray() {
           let result = [];
           for (let row = 0; row < this.rows; row++) {
               result.push([]);
               for (let col = 0; col < this.cols; col++) {
                   result[row].push(this.array[row * this.cols + col]);
               }
           }
           return result
       }

       static add(a, b) {
           //identical dimesions
           if (a.rows == b.rows && a.cols == b.cols) {
               let result = Mx.fromDims(a.rows, a.cols);
               for (let i = 0; i < a.rows * a.cols; i++) {
                   result.array[i] = a.array[i] + b.array[i];
               }
               return result
           }

           //one matrix has only on col,add columwise
           if ((a.cols == 1 || b.cols == 1) && (a.rows == b.rows)) {
               if (a.cols == 1){
                  let temp = a;
                  a = b;
                  b = temp;
               }

               let result = Mx.fromDims(a.rows, a.cols);
               for (let row = 0; row < a.rows; row++) {
                   for (let col = 0; col < a.cols; col++) {
                       result.array[a.cols * row + col] = a.array[a.cols * row + col] + b.array[row];
                   }
               }
               return result
           }
           throw "Matrices are not compatatible";
       }


       static sub(a, b) {
           if (a.rows == b.rows && a.cols == b.cols) {
               let result = Mx.fromDims(a.rows, a.cols);
               for (let i = 0; i < a.rows * a.cols; i++) {
                   result.array[i] = a.array[i] - b.array[i];
               }
               return result
           }
           throw "Matrices are not compatatible";
       }

       static multiplyElems(a, b) {
           if (a.rows == b.rows && a.cols == b.cols) {
               let result = Mx.fromDims(a.rows, a.cols);
               for (let i = 0; i < a.rows * a.cols; i++) {
                   result.array[i] = a.array[i] * b.array[i];
               }
               return result
           }
           throw "Matrices are not compatatible";
       }

       static scale(matrix, scale) {
           let result = Mx.fromDims(matrix.rows, matrix.cols);
           for (let i = 0; i < matrix.rows * matrix.cols; i++) {
               result.array[i] = matrix.array[i] * scale;
           }
           return result
       }

       static multiply(a, b, result) {
           if (a.cols == b.rows) {
               let result = Mx.fromDims(a.rows, b.cols);
               for (let row = 0; row < a.rows; row++) {
                   for (let col = 0; col < b.cols; col++) {
                       let sum = 0;
                       for (let k = 0; k < a.cols; k++) {
                           sum += a.array[row * a.cols + k] * b.array[k * b.cols + col];
                       }
                   result.array[b.cols * row + col] = sum;
                   }
               }
               return result
           }
           throw "Matrices are not compatatible";
       }

       static map(input, f) {
           let result = Mx.fromDims(input.rows, input.cols);
           for (let i = 0; i < input.array.length; i++) {
               result.array[i] = f(input.array[i]);
           }
           return result
       }

       static transpose(input) {
           let  result = Mx.fromDims(input.cols, input.rows);
           for (let row = 0; row < input.rows; row++) {
               for (let col = 0; col < input.cols; col++) {
                   result.array[col * input.rows + row] = input.array[row * input.cols + col];
               }
           }
           return result
       }

    
       static sum(input, axis) {
           if (axis == undefined){
               let sum = 0;
               for (let i = 0; i < input.rows * input.cols; i++) {
                   sum += input.array[i];
               }
               return sum
           } else if (axis == "cols"){
               let sum = Mx.fromDims(1, input.cols);
               for (let row = 0; row < input.rows; row++) {
                   for (let col = 0; col < input.cols; col++) {
                       sum.array[col] += input.array[input.cols * row + col]; 
                   }
               }
               return sum
           } else if (axis == "row"){
               let sum = Mx.fromDims(input.rows, 1);
               for (let row = 0; row < input.rows; row++) {
                   for (let col = 0; col < input.cols; col++) {
                       sum.array[row] += input.array[input.cols * row + col]; 
                   }
               }
               return sum
           }  
       }

       static max(input) {
           let max = input.array[0];
           for (let i = 0; i < input.rows * input.cols; i++) {
               if (input.array[i] > max) {
                   max = input.array[i];
               }
           }
           return max
       }

       static mean(input) {
           return this.sum(input) / input.array.length
       }


       static rowSum(input) {

           let sum = Mx.fromDims(input.rows, 1);

           for (let row = 0; row < input.rows; row++) {
               for (let col = 0; col < input.cols; col++) {
                   sum.array[row] += input.array[input.cols * row + col]; 
               }
           }
           return sum
       }

       static colSum(input) {

           let sum = Mx.fromDims(1, input.cols);

           for (let row = 0; row < input.rows; row++) {
               for (let col = 0; col < input.cols; col++) {
                   sum.array[col] += input.array[input.cols * row + col]; 
               }
           }
           return sum
       }

       static scaleCols(input,scale){
           let result = Mx.fromDims(input.rows, input.cols);

           for (let row = 0; row < input.rows; row++) {
               for (let col = 0; col < input.cols; col++) {
                  result.array[result.cols * row + col] = input.array[input.cols * row + col] * scale.array[col]; 
               }
           }
           return result
       }


      
   }

   const ActivationFunctions = {
        sigmoid: function (input, derivative) {
           if (derivative) {
               return Mx.map(input, (x) => x * (1 - x))
           }
           return Mx.map(input, (x) => 1 / (1 + Math.pow(Math.E, -x)))
       },

       relu: function (input, derivative) {
           if (derivative) {
               return Mx.map(input, (x) => (x > 0) ? 1 : 0)
           }
           return Mx.map(input, (x) => (x > 0) ? x : 0, 6)
       },

       softmax: function (input, derivative) {
           if (derivative) {
               return Mx.map(input, (x) => x * (1 - x))
           }
        
           let x_exp = Mx.map(input, (x) => Math.pow(Math.E, x ));
           let x_exp_sum = Mx.colSum(x_exp);
           return Mx.scaleCols(x_exp, Mx.map(x_exp_sum,(x) => 1/x) )
       }
   };

   function rand_guassian() {
       var u = 0,
           v = 0;
       while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
       while (v === 0) v = Math.random();
       return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
   }

   class FeedForwardNN {
       constructor(params) {

           if (params == undefined) {
               return
           }

           this.params = params;
           this.hidden_weights = Mx.fromDims(params.hidden_size, params.input_size);
           this.hidden_bias = Mx.fromDims(params.hidden_size, 1);
           this.hidden_activation_f = ActivationFunctions[params.hidden_activation];

           this.output_weights = Mx.fromDims(params.output_size, params.hidden_size);
           this.output_bias = Mx.fromDims(params.output_size, 1);
           this.output_activation_f = ActivationFunctions[params.output_activation];

           this.hidden_activation;
       }

       export () {

           return {
               params: this.params,
               hidden_weights: this.hidden_weights.toArray(),
               hidden_bias: this.hidden_bias.toArray(),
               output_weights: this.output_weights.toArray(),
               output_bias: this.output_bias.toArray()
           }
       }

       import (model) {
           this.params = model.params;
           this.hidden_weights = Mx.fromArray(model.hidden_weights);
           this.hidden_bias = Mx.fromArray(model.hidden_bias);
           this.output_weights = Mx.fromArray(model.output_weights);
           this.output_bias = Mx.fromArray(model.output_bias);

           this.hidden_activation_f = ActivationFunctions[model.params.hidden_activation];
           this.output_activation_f = ActivationFunctions[model.params.output_activation];
       }


       predict(x) {
           x = Mx.transpose(Mx.fromArray(x));
           let hidden_activation = this.hidden_activation_f(Mx.add(Mx.multiply(this.hidden_weights, x), this.hidden_bias), false);
           let output_activation = this.output_activation_f(Mx.add(Mx.multiply(this.output_weights, hidden_activation), this.output_bias), false);
           //for visualization purposes
           this.hidden_activation = hidden_activation;
           return Mx.transpose(output_activation).toArray()
       }

       train(x, y, learn_rate, epochs, loss_function, batch_size) {

           //creatre mini-batches
           let batches_x = [];
           let batches_y = [];

           for (let i = 0; i < x.length; i += batch_size) {
               let batch_x = x.slice(i, i + batch_size);
               let batch_y = y.slice(i, i + batch_size);
               batches_x.push(Mx.transpose(Mx.fromArray(batch_x)));
               batches_y.push(Mx.transpose(Mx.fromArray(batch_y)));
           }

           //init weights
           this.hidden_weights = Mx.map(this.hidden_weights, () => rand_guassian() * Math.sqrt(2 / this.params.input_size));
           this.output_weights = Mx.map(this.output_weights, () => rand_guassian() * Math.sqrt(2 / this.params.hidden_size));

           this.hidden_bias = Mx.map(this.hidden_bias, () => .1);
           this.output_bias = Mx.map(this.output_bias, () => .1);

           for (let epoch = 1; epoch <= epochs; epoch++) {
               let loss_sum = 0;
               for (let batch in batches_x) {

                   let _x = batches_x[batch];
                   let _y = batches_y[batch];

                   //feed forward
                   let hidden_activation = this.hidden_activation_f(Mx.add(Mx.multiply(this.hidden_weights, _x), this.hidden_bias), false);
                   let output_activation = this.output_activation_f(Mx.add(Mx.multiply(this.output_weights, hidden_activation), this.output_bias), false);

                   //error derivative
                   let error = Mx.sub(_y, output_activation);

                   let out_grad;
                   //gradient for output layer 
                   if (loss_function == "cross-entropy") {
                       out_grad = error;
                       loss_sum += (Mx.sum(Mx.map(error, (y) => (y > 0) ? -Math.log(1 - y) : -Math.log(y + 1))));

                   } else if (loss_function == "mean-squared") {
                       let slope_out = this.hidden_activation_f(output_activation, true);
                       out_grad = Mx.multiplyElems(error, slope_out);

                       loss_sum += (Mx.sum(Mx.multiplyElems(error, error)));
                   }

                   //gradient for hidden layer
                   let hidden_error = Mx.multiply(Mx.transpose(this.output_weights), out_grad);
                   let slope_hidden = this.output_activation_f(hidden_activation, true);
                   let hidden_grad = Mx.multiplyElems(hidden_error, slope_hidden);

                   //gradient for each weight
                   let output_weights_grad = Mx.multiply(out_grad, Mx.transpose(hidden_activation));
                   let hidden_weights_grad = Mx.multiply(hidden_grad, Mx.transpose(_x));

                   //update weights
                   this.output_weights = Mx.add(this.output_weights, Mx.scale(output_weights_grad, learn_rate * 1 / batch_size));
                   this.hidden_weights = Mx.add(this.hidden_weights, Mx.scale(hidden_weights_grad, learn_rate * 1 / batch_size));

                   //update biases
                   this.output_bias = Mx.add(this.output_bias, Mx.scale(Mx.rowSum(out_grad), learn_rate * 1 / batch_size));
                   this.hidden_bias = Mx.add(this.hidden_bias, Mx.scale(Mx.rowSum(hidden_grad), learn_rate * 1 / batch_size));

               }
               let loss = loss_sum / (batches_x.length * batch_size);
               console.log("epoch:", epoch + "/" + epochs, "loss:", loss);
           }
       }
   }

   exports.FeedForwardNN = FeedForwardNN;
   exports.Mx = Mx;

   Object.defineProperty(exports, '__esModule', { value: true });

})));
