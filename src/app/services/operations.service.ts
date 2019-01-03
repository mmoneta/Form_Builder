function get_key(questions, index: number, question: string) {
  return questions[index].questions.findIndex(item => item.content === question);
}

export function get_next_question(questions, questionComponents, index: number, parent_level: number) {
  if (questions[index]) {
    const possible_questions = questions[index].questions.filter(item => item.level === parent_level + 1);

    if (questionComponents.length > 0) {
      for (let i = 0; i < questionComponents.length; i++) {
        for (let j = 0; j < possible_questions.length; j++) {
          if (possible_questions[j].content === questionComponents[i].instance.question) {
            possible_questions.splice(j, 1);
          }
        }
      }
    }

    return possible_questions;
  }
  return false;
}

export function get_sequence(questions, index: number, parent_question: string, child_question: string) {
  const previous_key = get_key(questions, 0, parent_question),
  actual_key = get_key(questions, 0, child_question),
  levels = [];

  for (let i = previous_key; i <= actual_key; i++) {
    levels.push(questions[index].questions[i].level);
  }

  if (levels[0] !== levels[1]) {
    return true;
  }

  return false;
}
