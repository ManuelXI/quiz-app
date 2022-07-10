function Question(props) {
  const answerElements = props.answers.map((item) => (
    <p
      id={getID(item)}
      key={item.value}
      onClick={() => props.handleClick(props.question, item.value)}
    >
      {item.value}
    </p>
  ));

  function getID(vals) {
    const { isCorrect, isSelected, reveal } = vals;
    if (reveal) {
      if (isCorrect) return "show-correct";
      else if (isSelected && !isCorrect) {
        return "selected-but-wrong";
      } else return "show-incorrect";
    } else {
      if (isSelected) return "is-selected";
      else return "";
    }
  }

  return (
    <div className="question">
      <p>{props.question}</p>
      <div className="answers-group">{answerElements}</div>
      <div className="divider"></div>
    </div>
  );
}

export default Question;

{
  /* <p id="is-selected">Cowboy Bebop</p>
<p id="show-correct">High School DxD</p>
<p id="show-incorrect">Akira</p>
<p id="selected-but-wrong">Gurren Lagann</p> */
}
