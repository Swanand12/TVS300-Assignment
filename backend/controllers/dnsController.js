export const getDNSInfoController = async (req, res) => {
  try {
    const { domainName, infoType } = req.query;

    // required params for fetching data from whoisapi
    const params = {
      apiKey: process.env.API_KEY,
      domainName,
      outputFormat: "JSON",
    };

    // Convert params to queryString
    const queryString = new URLSearchParams(params).toString();

    // API URL
    const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?${queryString}`;

    // fetching data from whoisapi
    const response = await fetch(url);

    // throw error
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // parse data
    let data = await response.json();

    // Format the API response based on selected info type (domain or contact)
    if (infoType == "domain") {
      data = {
        Domain_Name: data.WhoisRecord.domainName,
        Registrar: data.WhoisRecord.registryData.registrarName,
        Registration_Date: data.WhoisRecord.registryData.createdDate.slice(
          0,
          10
        ),
        Expiration_Date: data.WhoisRecord.registryData.expiresDate.slice(0, 10),
        Estimated_Domain_Age: data.WhoisRecord.estimatedDomainAge,
        Hostnames: `${data.WhoisRecord.registryData.nameServers.hostNames
          .join(", ")
          .substring(0, 25)}...`,
      };
    } else {
      data = {
        Registrant_Name: data.WhoisRecord.registrant.organization,
        Technical_Contact_Name: data.WhoisRecord.technicalContact.organization,
        Administrative_Contact_Name:
          data.WhoisRecord.administrativeContact.organization,
        Contact_Email: data.WhoisRecord.contactEmail,
      };
    }

    res.status(200).json({
      success: true,
      message: "Successfully fetched data",
      dnsData: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching DNS data",
      error,
    });
  }
};
