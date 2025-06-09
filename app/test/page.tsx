'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

type ContentMetadata = {
  content_name: string;
  platform_name?: string;
};

type PersonMetadata = {
  person_name: string;
  associated: string;
};

type ContactInfo = {
  contact: string;
  type: 'email' | 'phone';
};

type LLMResponse = {
  text_response: string;
  content_metadata: ContentMetadata[];
  person_metadata: PersonMetadata[];
  contact_info: ContactInfo[];
};

const testdata: LLMResponse = {
    "text_response": "<h2>Market Overview for the Current Quarter</h2><br>The entertainment industry's dynamic landscape continues to evolve significantly this quarter, marked by strategic acquisitions, notable genre trends, and platform-specific developments. <br><br><h3>Key Observations</h3><p>Several major platforms, such as Netflix, Warner Bros., Disney, and Amazon, are focusing heavily on strategic investment and budget rationalization to drive ROI. These companies have shifted from a growth-at-all-costs model to prioritizing profit, efficiency, and audience engagement metrics. This shift has been crucial in an era defined by multiple, competing streaming services.</p><br><p>Platforms are tailoring their strategies to enhance audience appeal and sustain viewership. Amidst these changes, there is a focused investment in IP development and franchise extensions.<br><br><h3>Current Platform Trends</h3><ul><li><strong>Netflix:</strong> Investment in franchise-building through originals like \"Squid Game\" and \"Wednesday.\" Their strategy reflects a preference for efficient spending and high-return content`[1]`.</li><li><strong>Amazon:</strong> Emphasizing productions in UK, India, and Europe, leveraging their broader Prime ecosystem and expanding their reach in gaming`[2]``[3]`.</li><li><strong>Disney:</strong> Integrating streaming within a larger ecosystem encompassing parks, merchandise, and cross-platform IP`[4]`.</li><li><strong>Warner Bros. Discovery:</strong> Promoting sustainability by maximizing their extensive IP, including DC Universe and Game of Thrones`[5]`.</li></ul><br><h3>Genre and Content Mandates</h3><p>There's a marked interest in sophisticated dramas, crime thrillers, and historical narratives. Genres like comedy-drama hybrids and satires are sought for their cross-cultural appeal. Platforms are investing more in formats that blend genres effectively, especially with a satirical edge`[6]``[7]`.</p><br><p>Non-English language content is gaining traction, with major platforms increasing their budgets for international productions to cater to a global audience. This trend highlights the diminishing language barriers in content consumption globally`[8]`.</p><br><h3>Concluding Thoughts</h3><p>This quarter brings focused, strategic investments aimed at both consolidating existing strengths and exploring new potential markets and genres. Industry players are not just competing for audience numbers but striving for sustainable growth models and diversified revenue streams. </p><br><p>If you are interested in a more detailed analysis or wish to navigate these platforms for potential opportunities, I am here to provide further insights or detailed reports on platform-specific strategies. Feel free to ask about specific mandates or strategies for further clarity.</p>",
    "content_metadata": [
        {
            "content_name": "Squid Game",
            "platform_name": "Netflix"
        },
        {
            "content_name": "Wednesday",
            "platform_name": "Netflix"
        },
        {
            "content_name": "Game of Thrones",
            "platform_name": "HBO/Max"
        }
    ],
    "person_metadata": [
        {
            "person_name": "NULL",
            "associated": "Netflix"
        }
    ],
    "contact_info": []
}

export default function LLMResponsePage() {
  const { text_response, content_metadata, person_metadata, contact_info } = testdata;

  const sanitizedHTML = DOMPurify.sanitize(text_response);

  return (
    <main className="max-w-3xl mx-auto p-6 bg-background text-primary min-h-screen  mt-20">
     <div className='llm-response'>
      <section className="mb-6">
        <div
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </section>
      {content_metadata.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Mentioned Content</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {content_metadata.map((item, index) => (
              <li key={index}>
                <strong>{item.content_name}</strong>
                {item.platform_name && ` — available on ${item.platform_name}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Person Metadata */}
      {person_metadata.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Famous People Mentioned</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {person_metadata.map((person, index) => (
              <li key={index}>
                <strong>{person.person_name}</strong> — associated with <em>{person.associated}</em>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contact Info */}
      {Array.isArray(contact_info) && contact_info.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Contact Information</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {contact_info.map((contact, index) => (
              <li key={index}>
                {contact.type === 'email' ? (
                  <a href={`mailto:${contact.contact}`} className="text-blue-600 dark:text-blue-400 underline">
                    {contact.contact}
                  </a>
                ) : (
                  <a href={`tel:${contact.contact}`} className="text-blue-600 dark:text-blue-400 underline">
                    {contact.contact}
                  </a>
                )} ({contact.type})
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
    </main>
  );
}
