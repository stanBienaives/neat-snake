const tf = require('@tensorflow/tfjs');


/** Simple Neural Network library that can only create neural networks of exactly 3 layers */
class NeuralNetwork {

  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {number} input_nodes input nodes
   * @param {number} hidden_nodes  hiddenn layer
   * @param {number} output_nodes output layer
   */
  constructor(input_nodes = 10, hidden_nodes = 20, output_nodes = 1) {

    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    // Initialize random weights
    this.input_weights = tf.randomNormal([this.input_nodes, this.hidden_nodes]);
    this.output_weights = tf.randomNormal([this.hidden_nodes, this.output_nodes]);
  }

  /**
   * Takes in a 1D array and feed forwards through the network
   * @param {array} - Array of inputs
   */

  predict(user_input) {
    let output = null;

    tf.tidy(() => {
      const input_layer = tf.tensor(user_input, [1, this.input_nodes]);
      const hidden_layer = input_layer.matMul(this.input_weights).sigmoid();
      const output_layer = hidden_layer.matMul(this.output_weights).sigmoid();

      output = output_layer.dataSync();
    });

    return output;
  }

  /**
   * Returns a new network with the same weights as this Neural Network
   * @returns {NeuralNetwork} Returns cloned neural network
   */
  clone() {
    const clonie = new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);

    clonie.dispose();
    clonie.input_weights = tf.clone(this.input_weights);
    clonie.output_weights = tf.clone(this.output_weights);

    return clonie;
  }


  /**
   * Get weights as an nj.array
   * @returns {array} returns weight and bias as array
   */
  getDna() {
    return Array.from(this.input_weights.dataSync()).concat(Array.from(this.output_weights.dataSync()))
  }

  /**
   * Set weight as an nj.
   * @param {array} dna weight and biases as array
   * @return {undefined}
   */
  setDna(dna) {
    const input_weights = Float32Array.from(dna.slice(0, this.input_weights.shape[0]));
    const output_weights = Float32Array.from(dna.slice(this.input_weights.shape[0], this.output_weights.shape[0]));

    this.input_weights = tf.tensor1d(input_weights);
    this.output_weights = tf.tensor1d(output_weights);
  }

  /**
   * Dispose the input and output weights from the memory
   * @returns {undefined}
   */
  dispose() {
    this.input_weights.dispose();
    this.output_weights.dispose();
  }
}

module.exports = NeuralNetwork;