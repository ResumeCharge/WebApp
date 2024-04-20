const formatStrings = (text: string, regex: RegExp) : string =>{
  const updatedText = text.replace(regex,"\\n");
  return updatedText;
}

export default formatStrings;