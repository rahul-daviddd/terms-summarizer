package app.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.RestController;
import app.service.SummaryService;

@RestController
@RequestMapping("/api")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    @PostMapping("/summarize")
    public String summarize(@RequestBody String text) {
        return summaryService.summarize(text);
    }
}
