const fs = require('fs');
const path = 'js/data/syllabus.js';
let content = fs.readFileSync(path, 'utf8');

const searchStr = `"code": "tam_3_t1_l8"`;
const index = content.indexOf(searchStr);

if (index !== -1) {
    // Find the closing brackets after this
    // Structure:
    //               "code": "tam_3_t1_l8"
    //             }
    //           ]
    //         }
    //       ]
    //     }
    
    let after = content.substring(index);
    let closingPartMatch = after.match(/\}\s*\]\s*\}\s*\]\s*\}/);
    if (closingPartMatch) {
        let closingPart = closingPartMatch[0];
        let insertPos = index + after.indexOf(closingPart) + closingPart.length;
        
        const term2Block = `,\n      {\n        "term": 2,\n        "units": [\n          {\n            "title": "பாடப்பகுதிகள்",\n            "topics": [\n              {\n                "title": "காட்டில் திருவிழா மற்றும் கொழுக்கட்டை ஏன் வேகல",\n                "isUpdated": true,\n                "code": "tam_3_t2_l1"\n              },\n              {\n                "title": "எழில் கொஞ்சும் அருவி (ஒகேனக்கல் பயணம்)",\n                "isUpdated": true,\n                "code": "tam_3_t2_l2"\n              },\n              {\n                "title": "கல்வி கண் போன்றது",\n                "isUpdated": true,\n                "code": "tam_3_t2_l3"\n              },\n              {\n                "title": "வீம்பால் வந்த விளைவு",\n                "isUpdated": true,\n                "code": "tam_3_t2_l4"\n              },\n              {\n                "title": "நூலகம்",\n                "isUpdated": true,\n                "code": "tam_3_t2_l5"\n              },\n              {\n                "title": "நாயும் ஓநாயும்",\n                "isUpdated": true,\n                "code": "tam_3_t2_l6"\n              },\n              {\n                "title": "திருக்குறள் கதைகள்",\n                "isUpdated": true,\n                "code": "tam_3_t2_l7"\n              }\n            ]\n          }\n        ]\n      }`;
        
        let newContent = content.substring(0, insertPos) + term2Block + content.substring(insertPos);
        fs.writeFileSync(path, newContent, 'utf8');
        console.log("Successfully updated syllabus.js");
    } else {
        console.error("Could not find closing structure");
    }
} else {
    console.error("Could not find search string");
}
