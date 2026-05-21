const Imap = require("imap");
const { simpleParser } = require("mailparser");

let imap = null; // Shared instance accessible in all functions

function startImapListener({
  user,
  password,
  host = "imap.privateemail.com",
  port = 993,
}) {
  imap = new Imap({
    user,
    password,
    host,
    port,
    tls: true,
  });

  function openInbox(cb) {
    imap.openBox("INBOX", true, cb); // Read-only
  }

  imap.once("ready", () => {
    openInbox((err, box) => {
      if (err) throw err;
      console.log("📥 INBOX opened");

      // Only listen for new mail here (not fetch all)
      imap.on("mail", (numNewMsgs) => {
        console.log(`🔔 New mail received (${numNewMsgs})`);
        // Emit via socket or call fetch logic on latest only
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error:", err);
  });

  imap.once("end", () => {
    console.log("IMAP connection closed");
  });

  imap.connect();
}

function fetchAllEmails(page = 1, perPage = 10, filterSeen = null) {
  return new Promise((resolve, reject) => {
    if (!imap || imap.state !== "authenticated") {
      return reject(new Error("IMAP not connected"));
    }

    imap.search(["ALL"], (err, results) => {
      if (err) return reject(err);
      if (!results || results.length === 0) {
        return resolve({ emails: [], totalItems: 0 });
      }

      const reversedResults = [...results].reverse();
      const emailPromises = [];

      const fetch = imap.fetch(reversedResults, { bodies: "" });

      fetch.on("message", (msg, seqno) => {
        let buffer = "";
        let attributes = null;

        msg.on("attributes", (attrs) => {
          attributes = attrs;
        });

        msg.on("body", (stream) => {
          stream.on("data", (chunk) => {
            buffer += chunk.toString("utf8");
          });

          stream.once("end", () => {
            const promise = simpleParser(buffer)
              .then((mail) => {
                const seen = attributes?.flags?.includes("\\Seen") || false;

                return {
                  from: mail.from?.text,
                  subject: mail.subject,
                  text: mail.text,
                  html: mail.html,
                  date: mail.date ? new Date(mail.date) : null,
                  seen,
                };
              })
              .catch((err) => {
                console.error("Mail parse error:", err);
                return null;
              });

            emailPromises.push(promise);
          });
        });
      });

      fetch.once("error", (err) => reject(err));

      fetch.once("end", async () => {
        try {
          let parsedEmails = await Promise.all(emailPromises);
          parsedEmails = parsedEmails.filter(Boolean);

          // Filter by seen/unseen if requested
          if (filterSeen !== null) {
            parsedEmails = parsedEmails.filter(
              (email) => email.seen === filterSeen
            );
          }

          const totalFiltered = parsedEmails.length;

          // Pagination
          const start = (page - 1) * perPage;
          const paginatedEmails = parsedEmails.slice(start, start + perPage);

          resolve({
            emails: paginatedEmails,
            totalItems: totalFiltered,
            totalPages: Math.ceil(totalFiltered / perPage),
            currentPage: page,
            perPage,
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
}

module.exports = { startImapListener, fetchAllEmails };
