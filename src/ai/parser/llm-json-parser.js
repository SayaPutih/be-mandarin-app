export const llmJsonParse = (response)=>{
    const content = response.choices[0].message.content
        .replace(/```json/g,"")
        .rplace(/```/g,"")
        .trim();

    return JSON.parse(content);
}