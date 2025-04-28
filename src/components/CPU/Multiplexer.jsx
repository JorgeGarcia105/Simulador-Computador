const Multiplexer = ({ inputs, select }) => {
    return (
      <div className="multiplexer">
        <h4>Multiplexor</h4>
        <div>Seleccionado: {inputs[select]}</div>
      </div>
    );
  };
  
  export default Multiplexer;
  