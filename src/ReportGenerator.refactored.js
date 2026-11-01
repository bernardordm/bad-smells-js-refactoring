const PRIORITY_THRESHOLD = 1000;
const USER_VALUE_LIMIT = 500;

export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const visibleItems = this._filterItems(items, user);
    const total = visibleItems.reduce((sum, item) => sum + item.value, 0);

    let report = this._generateHeader(reportType, user);
    for (const item of visibleItems) {
      report += this._formatItemRow(reportType, item, user);
    }
    report += this._generateFooter(reportType, total);

    return report.trim();
  }

  _filterItems(items, user) {
    if (user.role === 'ADMIN') return items;
    return items.filter((item) => item.value <= USER_VALUE_LIMIT);
  }

  _generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }
    return (
      `<html><body>\n` +
      `<h1>Relatório</h1>\n` +
      `<h2>Usuário: ${user.name}</h2>\n` +
      `<table>\n` +
      `<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`
    );
  }

  _generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }
    return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
  }

  _formatItemRow(reportType, item, user) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    const style = item.value > PRIORITY_THRESHOLD ? ' style="font-weight:bold;"' : '';
    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }
}
