export function VitaePage() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">Vitae</h1>
        <p className="text-gray-600">Author Page</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Selected Vitae</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="space-y-2">
                <p className="font-semibold text-lg">John S. Stritzinger</p>
                <p className="text-red-700 font-medium">Global Tech Executive & Graduate Researcher</p>
                <p>Columbia, South Carolina 29201</p>
                <p className="mt-4">
                  <a href="mailto:stritzj@email.sc.edu" className="text-blue-600 hover:underline">
                    stritzj@email.sc.edu
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">Database Administration(DBA) & Principal Data Architecture Assignments</h3>
              <p className="text-gray-700 leading-relaxed">
                Bank of America/MBNA Treasury Systems, M&T Bank/Wilmington Trust Treasury Systems, Bank of America Consumer Services, Bank of America Global Operations, Centurylink/Level(3) Network Operations, Cincinnati Bell Enterprise Sales Operations, Bank of America Call Center Operations
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">University Programs(5)</h3>
              <p className="text-gray-700 leading-relaxed">
                University of Michigan, University of Delaware, University of South Carolina, University of Pennsylvania - Wharton School
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">Network Management Tools(11)</h3>
              <p className="text-gray-700 leading-relaxed">
                Cisco Works, BMC Patrol, Kratos Networks, IBM Netcool, IBM Maximo, HPE Peregrine, HPE Openview, Ivanti LandeskManager, Microsoft SMS, Alcatel, Paradyne NMS, Greenville GEM
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">ERP Tools(9)</h3>
              <p className="text-gray-700 leading-relaxed">
                Microsoft Dynamics SL, Oracle Financials, Oracle/Peoplesoft HR, IntuitQuickBooks, FusionShell Professional, Siebel Systems, SAP Financials, Solomon III, Peachtree
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">Restaurant Systems(7)</h3>
              <p className="text-gray-700 leading-relaxed">
                Aloha, Micros, POSI, KDS, FiveGuys POS, Panera POS, FusionCommerce
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">REST Frameworks(5)</h3>
              <p className="text-gray-700 leading-relaxed">
                Microsoft Entity Framework on VS2022+, NodeJS-Express, JoomlaAPI, WordpressAPI, MiniOrangePlugin
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">Programming Languages(19)</h3>
              <p className="text-gray-700 leading-relaxed">
                Lisp, Fortran, C, C++, C#, PHP, Webmin/Virtual SL, Python, HTML, Javascript, ReactJS/IonicJS, Visual Basic, Visual C++, Java/JavaFX, Motorola Assembler, ProcomPlus SL, NodeJS, UnixShell Scripting, Haskell
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">Visualization Frameworks(6)</h3>
              <p className="text-gray-700 leading-relaxed">
                Tableau Public/Desktop, SAP Crystal Reports, Microsoft Office Tools, Python Viz Libraries, RStudio/RFrameworks, Infovista Network Management Systems, ChartJS, D3 JS Libraries.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-700">Database Platforms(9)</h3>
              <p className="text-gray-700 leading-relaxed">
                MySql/MariaDB, MySql Clusters, MS/Azure SQLServer, Oracle 19i+, Postgres17+, AzCosmosDB/MongoDB, PervasiveSQL, MSAccess, WatcomSQL, ApacheHiveHQX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}