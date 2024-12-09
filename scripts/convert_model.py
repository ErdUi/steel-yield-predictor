            false_fn = lambda: recurse(children_right[node_id])
            return tf.cond(condition, true_fn, false_fn)
        
        def create_tree_model(x):
            return recurse(0)
        
        return create_tree_model
    
    tree_models = [create_tf_tree(tree) for tree in rf_model.estimators_]
    
    @tf.function
    def ensemble_predict(x):
        predictions = [model(x) for model in tree_models]
        mean = tf.reduce_mean(predictions, axis=0)
        std = tf.math.reduce_std(predictions, axis=0)
        return tf.stack([mean, std], axis=-1)
    
    return ensemble_predict

def main():
    # Load the scikit-learn model
    rf_model = joblib.load('rf_model.joblib')
    
    # Convert to TensorFlow
    input_shape = (None, 4)  # [QC_Re, QC_Rm, QC_A, Dimension]
    tf_model = convert_rf_to_tf(rf_model, input_shape)
    
    # Save the model
    tf.saved_model.save(tf_model, 'tf_model')

if __name__ == '__main__':
    main()