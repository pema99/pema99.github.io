using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Text;

public class Program
{
    public static void Main()
    {
        // Enumerate files in the directory
        string[] files = Directory.GetFiles("questions", "*.md");

        StringBuilder sb = new StringBuilder();
        sb.AppendLine("const questions = [");
        foreach (string file in files)
        {
            // Read the file
            string content = File.ReadAllText(file);

            // Extract the question using regex
            var question = Regex.Match(content, @"(?s)\`\`\`cs(.*)\`\`\`");
            string questionContent = question.Groups[1].Value.Trim()
                .Replace("\r", "")
                .Replace("\n", "\\n")
                .Replace("\"", "\\\"");

            // Extract the answer
            var answer = Regex.Match(content, @"Answer: (.*)");
            string answerContent = answer.Groups[1].Value.Trim();

            // Extract SharpLab url
            var sharpLabUrl = Regex.Match(content, @"SharpLab: (.*)");
            string sharpLabUrlContent = sharpLabUrl.Groups[1].Value.Trim();

            // Extract hint
            var hint = Regex.Match(content, @"(?s)Hint:\w*(.*)Explanation:");
            string hintContent = hint.Groups[1].Value.Trim();

            // Extract explanation
            var explanation = Regex.Match(content, @"(?s)Explanation:\w*(.*)");
            string explanationContent = explanation.Groups[1].Value.Trim()
                .Replace("\r", "")
                .Replace("\n", "\\n")
                .Replace("\"", "\\\"");

            // Print JS
            sb.AppendLine("    {");
            sb.AppendLine($"        question: \"{questionContent}\",");
            sb.AppendLine($"        answer: \"{answerContent}\",");
            sb.AppendLine($"        explanation: \"{explanationContent}\",");
            sb.AppendLine($"        hint: \"{hintContent}\",");
            sb.AppendLine($"        sharpLabUrl: \"{sharpLabUrlContent}\"");
            sb.AppendLine("    },");
        }
        sb.AppendLine("];");

        // Write to file
        File.WriteAllText("questions.js", sb.ToString());
    }
}