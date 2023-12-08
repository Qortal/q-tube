export function extractTextFromSlate(nodes: any) {
    if(!Array.isArray(nodes)) return ""
    let text = "";
  
    for (const node of nodes) {
      if (node.text) {
        text += node.text;
      } else if (node.children) {
        text += extractTextFromSlate(node.children);
      }
    }
  
    return text;
  }